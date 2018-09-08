import * as web3 from 'web3';

declare let window: any;

export class Search {
  private accounts: string;

  constructor() {

  }

  async activate() {
    this.accounts = window.web3.eth.accounts;
    console.log(this.accounts);
  }

}
