
var HDWalletProvider = require("truffle-hdwallet-provider");
//var mnemonic =  "off find version cram note manage runway execute prevent auction keep suggest"
var mnemonic =  "blanket amateur mobile involve inch exotic supreme gloom develop cage neutral velvet"
module.exports = {
  networks: {
    kovan: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://kovan.infura.io/LZb955hwnVIQOjGbNgx1",2)
      },
      network_id: 42,
      gas:7992188,
      gasPrice:10000000000
    },
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*", // Match any network id,
      gas:6721975
    }   
  }
};
