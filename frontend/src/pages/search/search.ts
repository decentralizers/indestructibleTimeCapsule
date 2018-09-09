import {inject} from 'aurelia-framework';

declare let window: any;

@inject('BlockchainHttpClient')
export class Search {
  private accounts: string;
  private blockchain: any;
  private publicKey: string;
  private privateKey: string;

  private testResponse: any = [
    {
      from: 'random acc number 1',
      date: '2018-08-12'
    },
    {
      from: 'random acc number 2',
      date: '2018-08-12'
    },
    {
      from: 'random acc number 3',
      date: '2018-08-12'
    }
  ];

  constructor(blockchain) {
    this.blockchain = blockchain;
  }

  public async read(data): Promise<void> {
    data.receiver_pubkey = this.publicKey;
    data.receiver_privkey = this.publicKey;

    const response: any = await this.blockchain.fetch('/decrypt', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    let temp = await response.json();
    if (temp.data.success) {
      // const hash = temp.data.hash;
      // const key = temp.data.key;
      //interact with eth contract

    }
  }

}
