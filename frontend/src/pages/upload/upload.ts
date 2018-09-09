import {inject} from 'aurelia-framework';
import Web3 from 'web3';

const contract = require('truffle-contract');

const tc_artifact = require('../../../../client/build/contracts/TimeCapsule.json');
const TimeCapsule = contract(tc_artifact);

declare let web3: any;

@inject('BlockchainHttpClient')
export class Uplad {
  private receivers: Array<string> = [];
  private receiver: string;
  private blockchain: any;
  private data: string;
  private date: string;
  private web3: any;

  constructor(blockchain) {
    this.blockchain = blockchain;

    if (typeof web3 !== 'undefined') {
         web3 = new Web3(web3.currentProvider);
     } else {
         // set the provider you want from Web3.providers
         web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
     }

    TimeCapsule.setProvider(self.web3.currentProvider);

  }

  public addReceiver(): void {
    if (this.receiver) {
      this.receivers.push(this.receiver);
      this.receiver = '';
    }
  }

  private async prepareContract(): void {

    TimeCapsule.deployed()
      .then(function (instance) {
        return instance.getMessagesByUser();
      })
      .then(function (value) {
        console.log('blockchain reply', value);
      })
      .catch(function (e) {
        console.error('blockchain error:', e.message);
      });

    const abi = [ { constant: false,
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function' },
    { constant: true,
      inputs: [],
      name: 'owner',
      outputs: [ [Object] ],
      payable: false,
      stateMutability: 'view',
      type: 'function' },
    { constant: true,
      inputs: [],
      name: 'isOwner',
      outputs: [ [Object] ],
      payable: false,
      stateMutability: 'view',
      type: 'function' },
    { constant: true,
      inputs: [ [Object], [Object] ],
      name: 'userMessages',
      outputs: [ [Object] ],
      payable: false,
      stateMutability: 'view',
      type: 'function' },
    { constant: true,
      inputs: [ [Object], [Object] ],
      name: 'messagesForUser',
      outputs: [ [Object] ],
      payable: false,
      stateMutability: 'view',
      type: 'function' },
    { constant: false,
      inputs: [ [Object] ],
      name: 'transferOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function' },
    { inputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor' },
    { anonymous: false,
      inputs: [ [Object] ],
      name: 'MessageCreated',
      type: 'event' },
    { anonymous: false,
      inputs: [ [Object] ],
      name: 'MessageRevoked',
      type: 'event' },
    { anonymous: false,
      inputs: [ [Object] ],
      name: 'OwnershipRenounced',
      type: 'event' },
    { anonymous: false,
      inputs: [ [Object], [Object] ],
      name: 'OwnershipTransferred',
      type: 'event' },
    { constant: false,
      inputs:
       [ [Object], [Object], [Object], [Object], [Object], [Object] ],
      name: 'createMessage',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function' },
    { constant: false,
      inputs: [ [Object] ],
      name: 'revokeMessage',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function' },
    { constant: true,
      inputs: [],
      name: 'getMessagesForUser',
      outputs: [ [Object] ],
      payable: false,
      stateMutability: 'view',
      type: 'function' },
    { constant: true,
      inputs: [],
      name: 'getMessagesByUser',
      outputs: [ [Object] ],
      payable: false,
      stateMutability: 'view',
      type: 'function' } ];

      const acc = await this.web3.eth.getAccounts();
      this.web3.eth.defaultAccount = acc[0];
    const addr = '0x27a6d1f2e561721580eba5f39d94f6193e2df860';
    var TimeCapsule = new this.web3.eth.Contract(abi, addr);


    let a = await TimeCapsule.methods.getMessagesForUser().call();
    console.log(a);
  }


  public async upload(): Promise<void> {
    await this.prepareContract();
    try {
      let postData: any = {
        Data: this.data,
        Date: this.date,
        Receivers: this.receivers
      };
      // const response: any = await this.blockchain.fetch('/encrypt', {
      //   method: 'POST',
      //   body: JSON.stringify(postData)
      // });
      // let temp = await response.json();
      // if (temp.data.success) {
      //   // const hash = temp.data.hash;
      //   // const key = temp.data.key;
      //   //interact with eth contract
      //
      // }
    } catch (e) {
      console.log('upload function failed: ', e.message)
    }
  }

}
