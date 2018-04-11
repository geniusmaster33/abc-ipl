import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Predictions } from './predictions';
import { PredictionData } from './prediction-data';
import { Web3Service } from '../../util/web3.service';
import * as match_artifact from '../../../../build/contracts/IPLMatch.json';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';

import * as moment from 'moment';

import * as $ from 'jquery/dist/jquery.min.js';

@Component({
  selector: 'app-match-predict',
  templateUrl: './match-predict.component.html',
  styleUrls: ['./match-predict.component.css']
})
export class MatchPredictComponent implements OnInit {
  todaysTeams;
  teamNames;
  isDataLoaded: boolean = false;
  isHalted = false;
  isBet = false;

  ipl: any;
  match: any;

  matchIndex:number;

  allPredictions: Predictions;

  totalBalance: number; //TODO - Needs to be fetched from server

  remainingBalance: number;
  matchInfoTxt: string;

  intervalHandler;

  multipliers: number[] = new Array(6);

  testC = 0;

  isBetSubmitted;

  constructor(private http: Http,
    private route: ActivatedRoute,
    private web3Service: Web3Service) { }

  ngOnInit() {
    this.allPredictions = new Predictions();
    this.totalBalance = this.web3Service.getBalance();

    console.log("Balance here " + this.totalBalance);
    this.matchInfoTxt = '';
    this.isBetSubmitted = false;

    this.findTeamNames();
  }

  findTeamNames() {
    const teamNamesFromURL = this.route.snapshot.paramMap.get('teams');
    this.teamNames = teamNamesFromURL.split("-");
    console.log("######## Team names : " + this.teamNames[0] + " - " + this.teamNames[1]);
    this.matchIndex = this.teamNames[2] - 1;

    this.fetchSquads();
    this.getMatchInfo();
    //this.checkIfBet();
  }

  fetchSquads() {
    const url = './../assets/info/teams.json';
    this.http.get(url).subscribe(
      (data) => {
        this.todaysTeams = data.json().filter(team => team.name == this.teamNames[0] || team.name == this.teamNames[1]);
        console.log("Todays team ", this.todaysTeams);
        this.isDataLoaded = true;
      },
      (error) => console.log(error)
    )
  }

  updateRange(event) {
    console.log("Inside updateRange ", event.target.value);
  }

  get diagnostic() { return JSON.stringify(this.allPredictions); }

  get getBalance() {
    // this.counter++;
    //console.log("getBalance - " + this.counter);
    let available = 0;

    available = this.totalBalance
      - (!this.allPredictions.highestScorer.assignedPoints ? 0 : this.allPredictions.highestScorer.assignedPoints)
      - (!this.allPredictions.bestBowler.assignedPoints ? 0 : this.allPredictions.bestBowler.assignedPoints)
      - (!this.allPredictions.mom.assignedPoints ? 0 : this.allPredictions.mom.assignedPoints)
      - (!this.allPredictions.winningTeam.assignedPoints ? 0 : this.allPredictions.winningTeam.assignedPoints)
      - (!this.allPredictions.score.assignedPoints ? 0 : this.allPredictions.score.assignedPoints)

    this.remainingBalance = available;

    return available;
  }

  submitPredictions() {
    console.log("About to predict");

    this.web3Service.artifactsToContract(ipl_artifact)
      .then((response) => {
        this.ipl = response;
        this.ipl.deployed().then((instance) => {
          instance.getMatchByIndex.call(this.matchIndex).then((matchAddr) => { //TODO 
            console.log("Match address - ", matchAddr);
            this.web3Service.artifactsToContract(match_artifact)
              .then((m) => {
                console.log("Register preresponse ", m);
                this.match = m;
                this.match.at(matchAddr).then((instance1) => {
                  instance1.bet.sendTransaction([this.allPredictions.winningTeam.assignedPoints,
                                                this.allPredictions.highestScorer.assignedPoints, 
                                                this.allPredictions.bestBowler.assignedPoints,
                                                this.allPredictions.mom.assignedPoints,
                                                this.allPredictions.score.assignedPoints], 
                                                [ this.allPredictions.winningTeam.prediction, 
                                                  this.allPredictions.highestScorer.prediction, 
                                                 this.allPredictions.bestBowler.prediction, 
                                                 this.allPredictions.mom.prediction,
                                                 this.allPredictions.score.prediction],
                    { from: this.web3Service.getKey(), gas: 500000, gasPrice: 20000000000 })
                    .then((v) => {
                      console.log("Match Predict result - " + v);

                      this.isBetSubmitted = true;
                      //this.intervalHandler = setInterval(() => this.checkIfBet(), 3000);
                    });
                });
              })
          })
        })
      }
      );
  }

  async getMatchInfo() {
    console.log("About to check if match halted");
    //let isHalted = true;

    const iplContract = await this.web3Service.artifactsToContract(ipl_artifact);
    const instance = await iplContract.deployed();
    const matchAddr = await instance.getMatchByIndex.call(this.matchIndex);
    const matchContract = await this.web3Service.artifactsToContract(match_artifact);
    const matchInstance = await matchContract.at(matchAddr);
    this.isHalted = await matchInstance.isHalted.call();
    console.log("GetMatchInfo : isHalted ", this.isHalted);

    //let isAlreadyBet = await matchInstance.isBet.call(this.web3Service.getKey);
    //console.log("isAlreadyBet ", isAlreadyBet);

    //await instance.haltSwitch.sendTransaction(true, {from: this.web3Service.getKey(), gas: 300000 });

    for (let index = 0; index < 6; index++) {
      this.multipliers[index] = await matchInstance.multiplier.call(index);
    }

    if(this.isHalted == false) {
      this.checkIfBet();
    }
    else {
      this.matchInfoTxt = 'Predictions are stopped now !';
      this.isDataLoaded = true;
    }
    
  }

  async checkIfBet() {
    console.log("About to check if prediction allowed for user " + this.testC);
    let isBet;
    this.testC++;

    if(this.testC === 3 ) {
      clearInterval(this.intervalHandler);

      console.log("Interval stopped");
    }
    

    
    const iplContract = await this.web3Service.artifactsToContract(ipl_artifact);
    const instance = await iplContract.deployed();
    const matchAddr = await instance.getMatchByIndex.call(this.matchIndex);
    const matchContract = await this.web3Service.artifactsToContract(match_artifact);
    const matchInstance = await matchContract.at(matchAddr);
    //console.log("KEy ------ " + this.web3Service.getKey());
    isBet = await matchInstance.isBet.call(this.web3Service.getKey());
    this.isBet = isBet;
    console.log("isBet ", isBet);

    this.isDataLoaded = true;

    if(isBet == true) {
      this.matchInfoTxt = 'You have already predicted !'
      // if(!!this.intervalHandler) {
      //   this.intervalHandler.clearInterval();
      // }
    }
  }
  async getMultipliers() {

  }

  
}
