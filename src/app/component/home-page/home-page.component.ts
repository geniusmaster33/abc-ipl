import { Component, OnInit } from '@angular/core';
//import { Web3 } from 'web3-js';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  web3 :any;

  constructor() { }

  ngOnInit() {
    // this.getBalance();
  }

  // getBalance() {
  //   console.log("inside getBalance");
  //   this.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/rDtDtyNmAVjB12zhj5nn"));
    
  //   if (typeof this.web3 === 'undefined') {
  //     console.log('No web3 found, get MetaMask!')
  //   } else {
  //     console.log('Web3 found! Tips welcome!')
  //   }

  //   let account = this.web3.eth.accounts[0];

  //   this.web3.eth.getBalance(account, (err, balance) => {
  //     if (err) {
  //       console.log(err.message)
  //     }
      
  //     const ether = this.web3.fromWei(balance, 'ether')
  //     console.log(`Account balance: ${ether.toString()}`);
  //   })
  // }
}
