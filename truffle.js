
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic =  "off find version cram note manage runway execute prevent auction keep suggest"
module.exports = {
  networks: {
    kovan: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://kovan.infura.io/rDtDtyNmAVjB12zhj5nn",2)
      },
      network_id: 42
    },
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    }   
  }
};
