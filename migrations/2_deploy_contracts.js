var MetaCoin = artifacts.require("./MetaCoin.sol");
var EIP = artifacts.require("./EIP20");
var Ipl = artifacts.require("./Ipl.sol");
var AddressSet = artifacts.require("./AddressSetLib.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var Registry = artifacts.require("./Registration");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(AddressSet);
  deployer.deploy(EIP,0,"AbcCoin",0,"ABC").then(function(){
     return deployer.deploy(Registry,EIP.address).then(function(){
      deployer.link(SafeMath, [Ipl]);
      deployer.link(AddressSet,[Ipl]);
       return deployer.deploy(Ipl,Registry.address);
    })
  })
  // deployer.deploy(MetaCoin);
  // deployer.deploy(MetaCoin);
};
