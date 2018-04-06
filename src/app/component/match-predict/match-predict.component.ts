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

declare var jQuery: any;

@Component({
  selector: 'app-match-predict',
  templateUrl: './match-predict.component.html',
  styleUrls: ['./match-predict.component.css']
})
export class MatchPredictComponent implements OnInit {
  todaysTeams;
  teamNames;
  isDataLoaded: boolean = false;
  isHalted = true;

  ipl: any;
  match: any;

  counter = 0;
  matchIndex:number;

  allPredictions: Predictions;

  totalBalance: number; //TODO - Needs to be fetched from server

  remainingBalance: number;

  tempBet: number = 250;
  temp2: number;

  multipliers: number[] = new Array(6);

  constructor(private http: Http,
    private route: ActivatedRoute,
    private web3Service: Web3Service) { }

  ngOnInit() {
    this.allPredictions = new Predictions();
    //this.allPredictions.bestBowler = new PredictionData();
    //this.allPredictions.highestScorer = new PredictionData();

    //this.allPredictions.highestScorer.assignedPoints = 200;
    //this.allPredictions.bestBowler.prediction = "CSK1";
    this.totalBalance = this.web3Service.getBalance();

    console.log("Balance here " + this.totalBalance);

    console.log("Predictions ", this.allPredictions.highestScorer.assignedPoints);
    console.log("isDataLoaded" + this.isDataLoaded);

    this.findTeamNames();
    this.fetchSquads();
    //this.remainingBalance = 5000 - this.allPredictions.bestBowler.assignedPoints;


    this.checkIfPredicted();
  }

  findTeamNames() {
    const teamNamesFromURL = this.route.snapshot.paramMap.get('teams');
    this.teamNames = teamNamesFromURL.split("-");
    console.log("######## Team names : " + this.teamNames[0] + " - " + this.teamNames[1]);
    this.matchIndex = this.teamNames[2] - 1;

  }

  fetchSquads() {
    const url = './../assets/info/teams.json';
    this.http.get(url).subscribe(
      (data) => {
        this.todaysTeams = data.json().filter(team => team.name == this.teamNames[0] || team.name == this.teamNames[1]);
        console.log("Todays team ", this.todaysTeams);
        this.isDataLoaded = true;
        console.log("isDataLoaded " + this.isDataLoaded);
        //jQuery('select').material_select();
      },
      (error) => console.log(error),
      () => this.isDataLoaded = true
    )
  }

  // ngAfterViewInit() {
  //   jQuery('#sliderRegular').noUiSlider({
  //     start: 40,
  //     connect: "lower",
  //     range: {
  //         min: 0,
  //         max: 100
  //     }
  //   });
  // }

  updateRange(event) {
    console.log("Inside updateRange ", event.target.value);
  }

  handleEvent(eventData, action: string) {
    console.log("Entered handleEvent");

    // switch(action) {
    //   case 'tossWinnerEvent' :
    //     this.tossWinner = eventData.target.value;
    //     console.log("Toss Winner : ", this.tossWinner);
    //     break;
    //   case 'highestScorerEvent' :
    //     this.highestScorer = eventData;
    //     console.log("Highest Scorer : " + this.highestScorer);
    //     break;
    // }
  }

  // evaluateRemainingBalance(eventData) {
  //   console.log("%%%%%%%%%%%% " + eventData);
  //   this.remainingBalance = 5000 - this.allPredictions.highestScorer.assignedPoints;
  //   console.log("rem bal " + this.allPredictions.highestScorer.assignedPoints + " " + this.remainingBalance);
  // }

  get diagnostic() { return JSON.stringify(this.allPredictions); }

  get getBalance() {
    this.counter++;
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

  submitIt() {
    console.log("Requested for submit");
  }

  submitPredictions() {
    console.log("About to predict");
    this.web3Service.artifactsToContract(ipl_artifact)
      .then((response) => {
        //console.log("Register preresponse ", response);
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
                      if (v) { // If not registered
                      }
                    });
                });
              })
          })
        })
      }
      );
  }

  async checkIfPredicted() {
    console.log("About to check if prediction allowed for user");
    let isHalted = true;

    const iplContract = await this.web3Service.artifactsToContract(ipl_artifact);
    const instance = await iplContract.deployed();
    const matchAddr = await instance.getMatchByIndex.call(this.matchIndex);
    const matchContract = await this.web3Service.artifactsToContract(match_artifact);
    const matchInstance = await matchContract.at(matchAddr);
    isHalted = await matchInstance.isHalted.call();
    this.isHalted = isHalted;
    console.log("isHalted ", isHalted);

    //let isAlreadyBet = await matchInstance.isBet.call(this.web3Service.getKey);
    //console.log("isAlreadyBet ", isAlreadyBet);

    //await instance.haltSwitch.sendTransaction(true, {from: this.web3Service.getKey(), gas: 300000 });

    for (let index = 0; index < 6; index++) {
      this.multipliers[index] = await matchInstance.multiplier.call(index);
    }
    
    console.log("Multiplier " + this.multipliers);
  }

  async getMultipliers() {

  }
}
