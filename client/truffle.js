var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "";



module.exports = {
  networks: {
    // ropsten: {
    //   provider: function() {
    //     return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/9e9ca8465879458f8a9193f93a35d755")
    //   },
    //   network_id: 3,
    //   gas : 4700000
    // },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};