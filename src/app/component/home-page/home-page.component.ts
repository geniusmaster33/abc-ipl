import { Component, OnInit } from '@angular/core';
//import { Web3 } from 'web3-js';
import {Web3Service} from '../../util/web3.service';
import * as metacoin_artifacts from '../../../../build/contracts/MetaCoin.json';

//declare let window: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  accounts: string[];
  MetaCoin: any;
  
  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  status = '';

   constructor(private web3Service: Web3Service) {
    console.log('Constructor: ' + web3Service);
   // console.log(metacoin_artifacts);
  }

 ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.watchAccount();
    this.web3Service.artifactsToContract(metacoin_artifacts)
      .then((MetaCoinAbstraction) => {
        this.MetaCoin = MetaCoinAbstraction;
       console.log(this.MetaCoin);
      });
     
  }

  setStatus(status) {
    this.status = status;
  }
  
   watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      console.log(this.accounts);
      this.model.account = accounts[0];
      this.refreshBalance();
    });
  }
  async refreshBalance() {
    console.log('Refreshing balance');

    try {
      const deployedMetaCoin = await this.MetaCoin.deployed();
      const metaCoinBalance = await deployedMetaCoin.getBalance.call(this.model.account);
      console.log('Found balance: ' + metaCoinBalance);
      this.model.balance = metaCoinBalance;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

}
