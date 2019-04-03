import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
//import { Web3 } from 'web3-js';
import { Web3Service } from '../../util/web3.service';
import * as metacoin_artifacts from '../../../../build/contracts/MetaCoin.json';
import * as eip20_artifact from '../../../../build/contracts/EIP20.json';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';
import * as registration_artifact from '../../../../build/contracts/Registration.json';
import * as match_artifact from '../../../../build/contracts/IPLMatch.json';

declare var jQuery:any;

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
  //MetaCoin: any;
  Ipl: any;
  Regn: any;
  AbcCoin: any;

  infoUpdates: string;

  isHalted = false;

  showMoadl = "true"

  reregisterModel = {
    username: '',
    fullname: '',
    key: ''
  }

  model = {
    username: 'Welcome',
    amount: 5,
    receiver: '',
    balance: 'Loading...',
    account: ''
  };

  user = {
    id: '',
    name: '',
    key: ''
  }

  status = '';

  isAdmin = false;

  constructor(private web3Service: Web3Service,
    private router: Router,
    private http: Http) {
    // console.log(metacoin_artifacts);
  }

  ngOnInit(): void {
    console.log('Home Page OnInit' );
    this.accounts = this.web3Service.getAccount();
    //console.log("Accounts initial - " + this.accounts);

    if (this.accounts) {
      this.model.account = this.accounts[0];
      console.log("Account found from service : " + this.model.account);
      //this.refreshBalance(); 
      // TODO - Balance not getting updated
      this.isKeyRegistered();
       
      //this.getMatchInfo(); Uncomment this when you want to block predictiona after final match
      // and comment out the follow fetchBalance method
      this.fetchBalance();

      // this.getUserName();

      this.isAccountInfoLoaded = true;

      console.log('Invoking jQuery');
      
    }

    this.watchAccount();
    // this.web3Service.artifactsToContract(metacoin_artifacts)
    //   .then((MetaCoinAbstraction) => {
    //     this.MetaCoin = MetaCoinAbstraction;
    //     //console.log("Metacoin " + this.MetaCoin);
    //   });
    // console.log("Account ------ ", this.model.account);
  }

  setStatus(status) {
    this.status = status;
  }

  watchAccount() {
    //this.infoUpdates = 'Fetching account info';
    console.log("Watching account from Web3Service ");
    this.web3Service.accountsObservable.subscribe((accounts) => {
      // this.isRegisteredOnBlockchain = false; // Reset the flag if you find new
      this.accounts = accounts;
      this.model.account = accounts[0];
      console.log("Found fresh account ", this.accounts);
      this.infoUpdates = 'Account found';

      console.log('************************* ' + this.infoUpdates);

      this.user.key = this.model.account;
      this.web3Service.setKey(this.user.key);
      this.isKeyRegistered();
      //this.getMatchInfo(); Uncomment this when you want to block predictiona after final match
      // and comment out the follow fetchBalance method
      this.fetchBalance();
      
      // this.getUserName();

      this.isAccountInfoLoaded = true;
      console.log("@@@@@@@@@@@@@@@@@@@@@@ " + this.isAccountInfoLoaded);

      return;
    });

    //this.infoUpdates = 'Account info not found !! Might be an issue with Ethereum Client'
  }

  

  /*async*/ sendCoin() {
    console.log('Sending coin');
    var meta;
    var receiver = "0xf17f52151EbEF6C7334FAD080c5704D77216b732";
  }


  isKeyRegistered() {
    
    this.infoUpdates = 'Checking registration status';
    console.log('************************* ' + this.infoUpdates);

    this.web3Service.artifactsToContract(registration_artifact)
      .then((response) => {
        this.Regn = response;
        this.Regn.deployed().then((instance) => {
          instance.isTrustedPlayer.call(this.model.account).then((v) => {
            console.log("Is key registered - " + v);
            
            if (!v) { // If not registered
              this.infoUpdates = 'Redirecting to registration page';
              console.log('************************* ' + this.infoUpdates);
              jQuery('#myModal').modal('hide');
              this.router.navigate(['login', {key : this.model.account}]);
            }
            else {
              this.getUserName(v);
            }
          });
        },
          (e) => { 
            console.log('Error encountered in fetching registration status ', e);
            this.infoUpdates = 'Error in fetching registration status';
          });
      })
  }

  fetchBalance() {
    this.infoUpdates = 'Fetching Balance';
    console.log('************************* ' + this.infoUpdates);

    this.web3Service.artifactsToContract(eip20_artifact)
      .then((response) => {
        this.AbcCoin = response;
        this.AbcCoin.deployed().then((instance) => {
          instance.balanceOf.call(this.model.account).then((balance) => {
            //console.log(" AbcCoin Balance " + balance);

            if(this.isHalted == false) {
              this.model.balance = balance;
              this.web3Service.setBalance(balance);
              this.infoUpdates = 'Balance Retrieved';
              //console.log('************************* ' + this.infoUpdates);
            }
          });
        },
          (e) => { 
            console.log('Error encountered in fetching balance ', e);
            this.infoUpdates = 'Error in fetching balance';
          });
      })
  }

  getUserName(isKeyRegisteredOnBlockchain) {
    const url = 'http://abcipl.ml:4020/getName';

    this.http.get(url + "?pk=" + this.model.account).subscribe(
      (response) => {
        console.log("User Name " + response.text());
        let userInfo = response.text().split(',');
        this.model.username = userInfo[0];

        // console.log('Registered flag ', this.isRegisteredOnBlockchain);
        if(isKeyRegisteredOnBlockchain && userInfo[0] === 'Welcome') {
          console.log('Registered on Blockchain but not in Python API');
          jQuery('#myModal').modal('show');
        }

        if(userInfo.length == 2)  {
          this.isAdmin = true;
          this.web3Service.setIsAdminUser(true);
        }
      },
      (error) => {
        console.log("Error in getting user name : " + error);
      },
      () => {

      }
    )
  }

  /**
   * This metjhod to be used to disable home screen after final match to build suspense
   */
  async getMatchInfo() {
    console.log("About to check if match halted");
    //let isHalted = true;

    const iplContract = await this.web3Service.artifactsToContract(ipl_artifact);
    const instance = await iplContract.deployed();
    const matchAddr = await instance.getMatchByIndex.call(58);
    console.log(matchAddr);
    const matchContract = await this.web3Service.artifactsToContract(match_artifact);
    const matchInstance = await matchContract.at(matchAddr);
    this.isHalted = await matchInstance.isHalted.call();
    console.log("GetMatchInfo : isHalted ", this.isHalted);

    this.fetchBalance();
  }

  submitUserName() {
    const url = 'http://abcipl.ml:4020/login';

    console.log("About to submit");

    this.reregisterModel.username = this.reregisterModel.fullname;
    this.reregisterModel.key = this.user.key;

    console.log('Register', this.reregisterModel);

    this.http.post(url, this.reregisterModel).subscribe(
      (data) => {
        console.log("Account registered with login service");
        jQuery('#myModal').modal('hide');
        this.getUserName(true);
      },
      (error) => {
        console.log("Response code :  " + error.status);
      }
    )
  }
    

}
