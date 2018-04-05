declare var require: any
import {Injectable} from '@angular/core';
import Web3 = require('web3');
import {Subject} from 'rxjs/Rx';

import * as eip20_artifact from '../../../../build/contracts/EIP20.json';
import * as ipl_artifact from '../../../build/contracts/Ipl.json';
import * as match_artifact from '../../../../build/contracts/IPLMatch.json';

const contract = require('truffle-contract');
declare let window: any;

@Injectable()
export class Web3Service {
  private web3: Web3;
  private accounts: string[];
  public ready = false;
  public MetaCoin: any;
  public accountsObservable = new Subject<string[]>();

  public iplObservable = new Subject<number>();

  public Ipl: any;

  private key: string;
  private balance: number;

  constructor() {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('No web3? You should consider trying MetaMask!');

      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      //this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }
    this.refreshAccounts();
    setInterval(() => this.refreshAccounts(), 5000);
    //this.refreshAccounts();
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;

  }

  private refreshAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      console.log('Refreshing accounts');
      if (err != null) {
        console.warn('There was an error fetching your accounts.');
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length === 0) {
        console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }

      if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
        console.log('Observed new accounts');

        this.accountsObservable.next(accs);
        this.accounts = accs;
      }

      this.ready = true;
    });
  }

  public getAccount() {
    return this.accounts;
  }

  public async isRegistered(pubKey: string) {

    let val;
    console.log("Web3 isRegistered KEY - " + pubKey);
    this.artifactsToContract(ipl_artifact)
      .then((response) => {
        this.Ipl = response;
        console.log("IPL --- " + this.Ipl);

        let meta;
        this.Ipl.deployed().then((instance) => {

          console.log("Instance ------- ", instance);
          instance.numMatches.call().then((v) => {console.log("@@@@@@@@ " + v);
          val = v;
        return v;});

          this.iplObservable.next(val);
          console.log("Val ++++++++ ", val);
        //return instance.isTrustedSource.call(pubKey, {from: pubKey});
        },
      (e) => {});
      })
  }

  public getKey() {
    return this.key;
  }

  public setKey(key:string) {
    this.key = key;
  }

  public getBalance() {
    return this.balance;
  }

  public setBalance(balance:number) {
    this.balance = balance;
  }

}
