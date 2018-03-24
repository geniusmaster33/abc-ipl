import { Component, OnInit } from '@angular/core';
//import { Web3 } from 'web3-js';
import Web3 = require('web3');

declare let window: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  private web3: Web3;

  constructor() { }

  ngOnInit() {
    this.getBalance();
  }

   getBalance() {
  //   console.log("inside getBalance");
  //   this.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/rDtDtyNmAVjB12zhj5nn"));
    
    if (typeof window.web3 !== 'undefined') {
       console.log('No web3 found, get MetaMask!');
      this.web3 = new Web3(window.web3.currentProvider);
	console.log(this.web3);
	} else {
       console.log('Web3 found! Tips welcome!');
     }

	this.web3.eth.getAccounts((err,accs) => {
		console.log(accs);
	});

  //   let account = this.web3.eth.accounts[0];

  //   this.web3.eth.getBalance(account, (err, balance) => {
  //     if (err) {
  //       console.log(err.message)
  //     }
      
  //     const ether = this.web3.fromWei(balance, 'ether')
  //     console.log(`Account balance: ${ether.toString()}`);
  //   })
   }
}
