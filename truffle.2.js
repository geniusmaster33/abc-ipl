require('dotenv').config();
const Web3 = require("web3");
const web3 = new Web3();
const WalletProvider = require("truffle-wallet-provider");
const Wallet = require('ethereumjs-wallet');

// var mainNetPrivateKey = new Buffer(process.env["MAINNET_PRIVATE_KEY"], "hex")
// var mainNetWallet = Wallet.fromPrivateKey(mainNetPrivateKey);
// var mainNetProvider = new WalletProvider(mainNetWallet, "https://mainnet.infura.io/");

var kovanPrivateKey = new Buffer(process.env["KOVAN_PRIVATE_KEY"], "hex")
var kovanWallet = Wallet.fromPrivateKey(kovanPrivateKey);
var kovanProvider = new WalletProvider(kovanWallet, "https://kovan.infura.io/rDtDtyNmAVjB12zhj5nn");


module.exports = {
    networks: {
         development: {
              host: "127.0.0.1",
              port: 9545,
              network_id: "*" // Match any network id
            }
       },
    kovan: {
        provider: kovanProvider,
        // You can get the current gasLimit by running
        // truffle deploy --network rinkeby
        // truffle(rinkeby)> web3.eth.getBlock("pending", (error, result) =>
        //   console.log(result.gasLimit))
        gas: 4600000,
        gasPrice: web3.toWei("20", "gwei"),
        network_id: "*",
      },
};

