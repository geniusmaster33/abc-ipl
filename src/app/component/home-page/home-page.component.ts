import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
//import { Web3 } from 'web3-js';
import { Web3Service } from '../../util/web3.service';
import * as metacoin_artifacts from '../../../../build/contracts/MetaCoin.json';
import * as eip20_artifact from '../../../../build/contracts/EIP20.json';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';



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
  Ipl: any;
  AbcCoin: any;


  model = {
    username: 'Welcome',
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

  constructor(private web3Service: Web3Service, 
              private router: Router,
              private http : Http) {
    // console.log(metacoin_artifacts);
  }

  ngOnInit(): void {
    console.log('########## OnInit: ' + this.web3Service + "   " + this.isAccountInfoLoaded);
    this.accounts = this.web3Service.getAccount();
    //console.log("Accounts initial - " + this.accounts);

    if (this.accounts) {
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
      this.model.account = accounts[0];
      console.log("Found account ", this.accounts);

      this.user.key = this.model.account;

      this.web3Service.setKey(this.user.key);

      this.isKeyRegistered();
      this.fetchBalance();

      this.isAccountInfoLoaded = true;

      console.log("Account Info" + this.isAccountInfoLoaded);

      this.getUserName();

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
    this.Ipl.deployed()
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
        return meta.sendCoin(receiver, 10, { from: this.model.account });
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
    this.web3Service.artifactsToContract(ipl_artifact)
      .then((response) => {
        this.Ipl = response;
        this.Ipl.deployed().then((instance) => {
          console.log("Instance ------- ", instance);
          instance.isTrustedSource.call(this.model.account).then((v) => {
            console.log("@@@@@@@@ " + v);
            if (!v) { // If not registered
              this.router.navigate(['login', {key : this.model.account}]);
            }
          });
        },
          (e) => { });
      })
  }

  fetchBalance() {
    this.web3Service.artifactsToContract(eip20_artifact)
      .then((response) => {
        this.AbcCoin = response;
        this.AbcCoin.deployed().then((instance) => {
          console.log("Instance ------- ", instance);
          instance.balanceOf.call(this.model.account).then((balance) => {
            console.log(" AbcCoin Balance " + balance);
            this.model.balance = balance;
          });
        },
          (e) => { });
      })
  }

  getUserName() {
    const url = 'http://abcipl.club:4020/getName';

    this.http.get(url+"?pk="+this.model.account).subscribe(
      (response) => {
        console.log("User Name " + response.text());
        this.model.username = response.text();
      },
      (error) => {
        console.log("Error in getting todays date : " + error);
      },
      () => {

      }
    )
  }

}
