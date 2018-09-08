var HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config() // Store environment-specific variable from '.env' to process.env

module.exports = {
  networks: {
    // ropsten: {
    //   provider: function() {
    //     return new HDWalletProvider(process.env.MNENOMIC, "https://ropsten.infura.io/v3/9e9ca8465879458f8a9193f93a35d755")
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