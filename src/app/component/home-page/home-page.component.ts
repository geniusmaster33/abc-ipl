import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { Web3 } from 'web3-js';
import { Web3Service } from '../../util/web3.service';
import * as metacoin_artifacts from '../../../../build/contracts/MetaCoin.json';

//declare let window: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  isAccountInfoLoaded = false;
  isFirstTimeUser = false;

  accounts: string[];
  MetaCoin: any;

  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  user = {
    id: '',
    name: '',
    key: ''
  }

  status = '';

  constructor(private web3Service: Web3Service, private router: Router) {
    console.log('Constructor: ' + web3Service);
    // console.log(metacoin_artifacts);
  }

  ngOnInit(): void {
    console.log('########## OnInit: ' + this.web3Service + "   " + this.isAccountInfoLoaded);
    //this.accounts = this.web3Service.getAccount();
    //console.log("Accounts initial - " + this.accounts);

    if(this.accounts) {
      this.model.account = this.accounts[0];
      console.log("Account on init " + this.model.account);
     // this.refreshBalance(); 
     // TODO - Balance not getting updated
      this.isKeyRegistered();

      this.isAccountInfoLoaded = true;
    }

    this.watchAccount();
    this.web3Service.artifactsToContract(metacoin_artifacts)
      .then((MetaCoinAbstraction) => {
        this.MetaCoin = MetaCoinAbstraction;
        console.log("Metacoin " + this.MetaCoin);
      });
  console.log("Account ------ ", this.model.account);
  }

  setStatus(status) {
    this.status = status;
  }

  watchAccount() {
    console.log("Watching account ");
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      console.log(this.accounts);
      this.model.account = accounts[0];
      console.log("found account ", this.accounts);
      
      this.user.key = this.model.account;
      this.isKeyRegistered();
      this.refreshBalance();

      this.isAccountInfoLoaded = true;

      console.log("Account Info" + this.isAccountInfoLoaded );

    });
  }
  // async refreshBalance() {
  //   console.log('Refreshing balance');

  //   try {
  //     const deployedMetaCoin = await this.MetaCoin.deployed();
  //     const metaCoinBalance = await deployedMetaCoin.getBalance.call(this.model.account);
  //     console.log('Found balance: ' + metaCoinBalance);
  //     this.model.balance = metaCoinBalance;
  //   } catch (e) {
  //     console.log(e);
  //     this.setStatus('Error getting balance; see log.');
  //   }
  // }

  refreshBalance() {
    console.log('Refreshing balance');

    let meta;
    this.MetaCoin.deployed()
      .then((instance) => {
        meta = instance;
        return meta.getBalance.call(this.model.account, {
          from: this.model.account
        });
      })
      .then((value) => {
        this.model.balance = value;
        console.log('Balance : ' + value);
      })
      .catch((e) => {
        console.log(e);
        this.setStatus('Error getting balance; see log.');
      });
  }

  /*async*/ sendCoin() {
    console.log('Sending coin');
    var meta;
    var receiver = "0xf17f52151EbEF6C7334FAD080c5704D77216b732";
    //const deployedMetaCoin = /*await*/ this.MetaCoin.deployed();
    
    // deployedMetaCoin.sendCoin(account_one, 10, { from: this.model.account, gas: 4699999 }).then(function (result) {
    //   // If this callback is called, the transaction was successfully processed.
    //   console.log("Transaction successful!");
    //   this.refreshBalance();
    // }).catch(function (e) {
    //   // There was an error! Handle it.
    //   console.log('Error ', e);
    // })

    this.MetaCoin.deployed()
      .then((instance) => {
        meta = instance;
        return meta.sendCoin(receiver, 10, {from: this.model.account});
      })
      .then(() => {
        console.log('Coins sent successfully');
        this.refreshBalance();
      })
      .catch((e) => {
        console.log(e);
      })
  }

  isKeyRegistered() {
    // fetch key registration status
    this.isFirstTimeUser = false;

    //this.router.navigate(['login', {key : this.model.account}]);
    return false;
  }

}
