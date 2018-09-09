from flask import Flask, render_template, jsonify, request
from umbral import pre, keys, config, params
from umbral import  config as uconfig
from umbral.curve import SECP256K1
import msgpack
from umbral.signing import Signer
from nucypher import MockNetwork
import base64
import json
import ipfsapi
app = Flask(__name__)

config = ""
bob_pubkey = ""
mock_kms = ""

# our encoding
def bytes_to_string(b):
    encoded = base64.b64encode(b)
    return encoded.decode('utf-8')

def string_to_bytes(s):
    sd = s.encode('utf-8')
    return base64.b64decode(sd)

def setup():
    global config
    config = uconfig.set_default_curve()

    global mock_kms 
    mock_kms = MockNetwork()

    global api
    api = ipfsapi.connect('127.0.0.1', 5001)
    
    # global bob_privkey
    # global alice_privkey
    # global alice_pubkey

    # alice_pubkey, alice_privkey = gen_alice()
    # bob_privkey = alice_privkey

def gen_alice():
    # Generate Keys and setup mock network
    alice_privkey = keys.UmbralPrivateKey.gen_key()
    alice_pubkey = alice_privkey.get_pubkey()

    return alice_pubkey, alice_privkey
    
@app.route('/test', methods=["GET"])
def Test():
    poruka = "Testiranje"
    hash = api.add_json(poruka)
    return hash
    # return "Amazing!!!"

@app.route('/encrypt', methods=["POST"])
def encrypt():
    # Get data from request
    json_data = json.loads(request.data.decode('utf-8'))
    # json_data = json.loads("{ \"data\": \"TestiranjeEncrypt\", \"date\":\"2017-09-11\", \"recievers\" : [ \"publickey1\", \"publickey1\" ] }")
    data = json_data["data"].encode('utf-8')
    dateString = json_data["date"]
    print(dateString)
    recievers_key = json_data["recievers"]
 
    alice_pubkey, alice_privkey = gen_alice()
    
    # bob_privkey = alice_privkey

    # Encrypt some data
    plaintext = data
    ciphertext, capsule = pre.encrypt(alice_pubkey, plaintext)

    ipfsHash = api.add_json(bytes_to_string(capsule.to_bytes()))

    alice_signing_privkey = keys.UmbralPrivateKey.gen_key()
    alice_signing_pubkey = alice_signing_privkey.get_pubkey()
    alice_signer = Signer(alice_signing_privkey)

     # Perform split-rekey and grant re-encryption policy   keys.UmbralPublicKey.from_bytes(key.encode('utf-8')
    policy_ids = []
    for key in recievers_key:
        alice_kfrags = pre.split_rekey(alice_privkey, alice_signer, keys.UmbralPublicKey.from_bytes(string_to_bytes(key)), 10, 20)
        # alice_kfrags = pre.split_rekey(alice_privkey, alice_signer, alice_pubkey, 10, 20)
        policy_id = mock_kms.grant(alice_kfrags, dateString)
        policy_ids.append(policy_id)

    response = {
        "ciphertext": bytes_to_string(ciphertext),
        "policy_ids": policy_ids,
        "ipfsHash": ipfsHash,
        "alice_pubkey": bytes_to_string(alice_pubkey.to_bytes()),
        "alice_signing_pubkey": bytes_to_string(alice_signing_pubkey.to_bytes())
    }

    return jsonify(response)


@app.route('/decrypt', methods=["POST"])
def decrypt():
    # Get data from request
    json_data = json.loads(request.data.decode('utf-8'))
    # json_data = json.loads("{ \"alice_pubkey\": \"AvTifaAfuL1dTwGbDiBDmBiVRS7TCbNeDkrqKPesjTK6\", \"alice_signing_pubkey\": \"AmopleZUj7aSYA8M9sZGdRGwTMrUbVKUo5B36JXbD1\",  \"ciphertext\": \"LZN+p4DkpYo6nfXOLTMVO9rGKq00s9wVba27ydvjFF+jFjmNBC0dD29N5Irq\",\"ipfsHash\": \"QmS95HoTiDTTydAvCT9W3t7VHnip17T24DPZN5J6KkyLCa\",   \"policy_id\": \"a0228680-6bd9-4b2c-9669-bd0239c60c1f\"}")
    ciphertext, policy_id, ifpsHash, alice_pubkey, alice_signing_pubkey, readers_pubkey = json_data["ciphertext"], json_data["policy_id"], json_data["ipfsHash"], json_data["alice_pubkey"], json_data["alice_signing_pubkey"], json_data["readers_pubkey"]
    # ciphertext, policy_id, ifpsHash, alice_pubkey, alice_signing_pubkey = json_data["ciphertext"], json_data["policy_id"], json_data["ipfsHash"], json_data["alice_pubkey"], json_data["alice_signing_pubkey"]
    
    # convert to bytes
    ciphertext = string_to_bytes(ciphertext)
    capsule = string_to_bytes(api.get_json(ifpsHash))
    capsule = pre.Capsule.from_bytes(capsule, params.UmbralParameters(SECP256K1))
    alice_pubkey = string_to_bytes(alice_pubkey)
    alice_pubkey = keys.UmbralPublicKey.from_bytes(alice_pubkey)
    alice_signing_pubkey = string_to_bytes(alice_signing_pubkey)
    alice_signing_pubkey = keys.UmbralPublicKey.from_bytes(alice_signing_pubkey)
    readers_pubkey = string_to_bytes(readers_pubkey)
    readers_pubkey = keys.UmbralPublicKey.from_bytes(readers_pubkey)

    # Perform re-encryption request
    try:
        reciever_cfrags = mock_kms.reencrypt(policy_id, capsule, 10)
    except:
        # Failed to decrypt then 
        return  jsonify({
            "status": "could not decrypt",
        })
    # Simulate capsule handoff, and set the correctness keys.
    # Correctness keys are used to prove that a cfrag is correct and not modified
    # by a proxy node in the network. They must be set to use the `decrypt` and
    # `attach_cfrag` funtions.
    reciever_capsule = capsule
    # readers_privkey = bob_privkey
    # readers_pubkey = alice_pubkey
    reciever_capsule.set_correctness_keys(alice_pubkey, readers_pubkey, alice_signing_pubkey)
    for cfrag in reciever_cfrags:
        reciever_capsule.attach_cfrag(cfrag)
    decrypted_data = pre.decrypt(ciphertext, reciever_capsule, readers_privkey)

    decrypted_data = decrypted_data.decode('utf-8')

    return  jsonify({
        "decrypted_data": decrypted_data,
    })

if __name__ == '__main__':
    setup()
    app.run(host='127.0.0.1', port=8544, debug=True)

 
