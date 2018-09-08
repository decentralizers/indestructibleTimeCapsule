import {inject} from 'aurelia-framework';

@inject('BlockchainHttpClient')
export class Uplad {
  private receivers: Array<string> = [];
  private receiver: string;
  private blockchain: any;
  private data: string;
  private date: string;

  constructor(blockchain) {
    this.blockchain = blockchain;
  }

  public addReceiver(): void {
    if (this.receiver) {
      this.receivers.push(this.receiver);
      this.receiver = '';
    }
  }

  public async upload(): Promise<void> {
    try {
      let postData: any = {
        Data: this.data,
        Date: this.date,
        Receivers: this.receivers
      };
      const response: any = await this.blockchain.fetch('/encrypt', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
      let temp = await response.json();
      if (temp.data.success) {
        alert('success')
      }
    } catch (e) {
      console.log(e.message)
    }
  }

}
