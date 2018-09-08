import uuid
import random
from typing import List
from datetime import datetime

from umbral import pre, fragments
import requests 
import json


class MockNetwork(object):
    """
    This is a mock of the NuCypher network for Hackathons.

    Note: The actual network is not ready yet and is in current active development.
        Hackers should use this as a means to play with and simulate the real network.

    BASIC OVERVIEW:
        Call `grant` with a list of kfrags from Umbral to grant a policy on the mock
        network. This will return a policy id that you will use to access the mock network.

        Call `reencrypt` to perform a complete mocked re-encryption on the NuCypher network.
        This does not require that you search for nodes on the network, this works only if you know
        the minimum number of re-encryptions (`M`).

        Call `revoke` to revoke a policy on the mock NuCypher network. This works by simply
        deleting the kfrags off the mocked network.
    """


    def __init__(self):
        self.dateStamps = {}
        self.db = {}

    def grant(self, kfrags: List[fragments.KFrag], dueDate: str) -> str:
        """
        Creates a mock Policy on the NuCypher network.

        :param kfrags: A list of Umbral KFrags.

        :return: NuCypher Policy ID (str)
        """
        policy_id = str(uuid.uuid4())

        self.db[policy_id] = kfrags
        self.dateStamps[policy_id] = datetime.strptime(dueDate, '%Y-%m-%d')
        print(datetime.strptime(dueDate, '%Y-%m-%d'))
        return policy_id

    def scheduleReencrypt(self, policy_id: str, dueDate: str):
        self.dateStamps[policy_id] = datetime.strptime(dueDate, '%Y-%m-%d')
        print(datetime.strptime(dueDate, '%Y-%m-%d'))

    def reencrypt(self, policy_id: str, capsule: pre.Capsule, M: int) -> List[fragments.CapsuleFrag]:
        """
        Re-encrypts the given capsule 'M' number of times and returns a list
        of CapsuleFrags (CFrags) to be attached to the original Capsule.

        :param policy_id: Policy ID to access re-encryption.
        :param capsule: The Umbral capsule to re-encrypt.
        :param M: The number of times to re-encrypt the capsule for the minimum
            number of CFrags needed.

        :return: List of CFrags (CapsuleFrags).
        """

        print(self.db)
        try:
            kfrags = self.db[policy_id]
        except KeyError:
            raise ValueError("No Policy found for {}".format(policy_id))

        if M > len(kfrags):
            raise ValueError("Not enough KFrags to re-encrypt {} times!".format(M))

        present = datetime.now()
        if (present < self.dateStamps[policy_id]):
            print("Dude it's too early to see this!")
            raise ValueError("Dude it's too early to see this!")
        
        cfrags = []

        # TODO: using web3py check if is dead?  
        try:
            print(self.dateStamps)
            m_kfrags = random.sample(kfrags, M)
            for kfrag in m_kfrags:
                cfrags.append(pre.reencrypt(kfrag, capsule))
            return cfrags
        except:
            return cfrags
            
    def revoke(self, policy_id: str):
        """
        Revokes the Policy on the mock NuCypher network by deleting the policy
        and the associated kfrags.

        :param policy_id: The policy_id to revoke.
        """
        del(self.db[policy_id])
