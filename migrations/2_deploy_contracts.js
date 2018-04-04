var MetaCoin = artifacts.require("./MetaCoin.sol");
var EIP = artifacts.require("./EIP20");
var Ipl = artifacts.require("./Ipl.sol");
var AddressSet = artifacts.require("./AddressSetLib.sol");
var SafeMath = artifacts.require("./SafeMath.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(AddressSet);
  deployer.deploy(EIP,0,"AbcCoin",0,"ABC").then(function(){
    deployer.link(SafeMath, [Ipl]);
    deployer.link(AddressSet,[Ipl]);
    return deployer.deploy(Ipl,EIP.address);
  })
  // deployer.deploy(MetaCoin);
  // deployer.deploy(MetaCoin);
};
