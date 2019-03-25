import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Predictions } from './predictions';
import { PredictionData } from './prediction-data';
import { Web3Service } from '../../util/web3.service';
import * as match_artifact from '../../../../build/contracts/IPLMatch.json';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';
import { DataElement } from "./../model/DataElement";

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
  totalBetPut: number;
  matchInfoTxt: string;

  betLength: number;
  potSize: number[] = new Array(5);

  intervalHandler;

  multipliers: number[] = new Array(6);

  testC = 0;

  isBetSubmitted;
  isInputValid: boolean;

  q30PlusOptions = [
    {
      "displayTxt": "Less than 4",
      "value": "1"
    },
    {
      "displayTxt": "4",
      "value": "2"
    },
    {
      "displayTxt": "More than 4",
      "value": "3"
    }];

  qSixesOptions = [
    {
      "displayTxt": "0 - 10",
      "value": "1"
    },
    {
      "displayTxt": "11 - 17",
      "value": "2"
    },
    {
      "displayTxt": "More than 17",
      "value": "3"
    }];

    qWicketsOptions = [
      {
        "displayTxt": "0 - 9",
        "value": "1"
      },
      {
        "displayTxt": "10 - 12",
        "value": "2"
      },
      {
        "displayTxt": "13 - 15",
        "value": "3"
      },
      {
        "displayTxt": "More than 15",
        "value": "4"
      }];
  potSizeArray : DataElement[] = new Array(5);
  potSizeLoadCount = 0;

  id = 'chart1';
    type = 'doughnut2d';
    dataFormat = 'json';
    dataSource;

  constructor(private http: Http,
    private route: ActivatedRoute,
    private web3Service: Web3Service) { }

  ngOnInit() {
    this.potSizeLoadCount = 0;

    this.allPredictions = new Predictions();
    this.totalBalance = this.web3Service.getBalance();

    console.log("Balance here " + this.totalBalance);
    this.matchInfoTxt = '';
    this.isBetSubmitted = false;

    this.findTeamNames();

    this.dataSource = {
      "chart": {
          "caption": "",
          "subCaption": "",
          "theme": "ocean",
          "renderAt": "chartContainer",
          "width": "100%",
          "enableSmartLabels" : "1",
          "labelDistance": "5",
          "smartLabelClearance": "5",
          "use3DLighting": "0",
          "radius3D": "0",
          "showBorder": "0",
          "bgColor": "#FFFFFF",
          "showLabels": "0",
          "placeValuesInside" : "1",
          "showLegend": "1",
          "legendBorderThickness": "0",
          "legendCaptionAlignment": "center",
          "legendShadow": "0",
          "formatNumberScale": "0"
      },
      "data": []
    }
  }

  findTeamNames() {
    const teamNamesFromURL = this.route.snapshot.paramMap.get('teams');
    this.teamNames = teamNamesFromURL.split("-");
    console.log("######## Team names : " + this.teamNames[0] + " - " + this.teamNames[1]);
    this.matchIndex = this.teamNames[2] - 1;

    this.fetchSquads();
    this.getMatchInfo();

     for(let i = 0; i < 5; i++) {
       this.getPotSize(i);
    }
    
    //this.checkIfBet();
  }

  fetchSquads() {
    const url = './../assets/info/teams1.json';
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
      - (!this.allPredictions.score30Plus.assignedPoints ? 0 : this.allPredictions.score30Plus.assignedPoints)
      - (!this.allPredictions.sixes.assignedPoints ? 0 : this.allPredictions.sixes.assignedPoints)
      - (!this.allPredictions.wickets.assignedPoints ? 0 : this.allPredictions.wickets.assignedPoints)
      - (!this.allPredictions.winningTeam.assignedPoints ? 0 : this.allPredictions.winningTeam.assignedPoints)
      - (!this.allPredictions.score.assignedPoints ? 0 : this.allPredictions.score.assignedPoints)

    this.remainingBalance = available;

    this.totalBetPut = this.totalBalance - available;

    //console.log("Bet amount : " + this.totalBetPut);

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
                                                this.allPredictions.score30Plus.assignedPoints, 
                                                this.allPredictions.sixes.assignedPoints,
                                                this.allPredictions.wickets.assignedPoints,
                                                this.allPredictions.score.assignedPoints], 
                                                [ this.allPredictions.winningTeam.prediction, 
                                                  this.allPredictions.score30Plus.prediction, 
                                                 this.allPredictions.sixes.prediction, 
                                                 this.allPredictions.wickets.prediction,
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
                  instance1.getBetLength.call()
                    .then((v) => {
                      //console.log("Bet Length - " + v);
                      this.betLength = v;
                    });
                });
              })
          })
        })
      }
      );

    
  }

  async checkIfBet() {
    console.log("About to check if prediction allowed for user ");
    let isBet;
    
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

  validateInputs() {
    console.log("Validating.......");

    //console.log(this.allPredictions.score.isValid()  + this.allPredictions.score.prediction);

    if(!this.allPredictions.sixes.isValid() ||
       !this.allPredictions.score30Plus.isValid() ||
       !this.allPredictions.wickets.isValid() ||
       !this.allPredictions.score.isValid() ||
       !this.allPredictions.winningTeam.isValid()) {
         this.isInputValid = false;
    }
    else {
      this.isInputValid = true;
    }
  }

  getPotSize(index) {

    console.log("Trying to fetch pot sizes");

    this.web3Service.artifactsToContract(ipl_artifact)
      .then((response) => {
        this.ipl = response;
        this.ipl.deployed().then((instance) => {
          instance.getMatchByIndex.call(this.matchIndex).then((matchAddr) => { //TODO 
            console.log("qPot Match address - ", matchAddr);
            this.web3Service.artifactsToContract(match_artifact)
              .then((m) => {
                console.log("qPot Register preresponse ", m);
                this.match = m;
                this.match.at(matchAddr).then((instance1) => {
                  instance1.qPot.call(index)
                    .then((v) => {
                      this.potSize[index] = v;
                      console.log("Total " + this.potSize[index]);

                    });
                });
              })
          })
        })
      }
      );
  }

  // setPotSizeArrayForChart(index) {

  //   switch(index) {
  //     case 0 :
  //       let winner = new DataElement("Winning Team", this.potSize[0]);
  //       this.potSizeArray[0] = winner;
  //       this.incrementLoadCount();
  //       break;
  //     case 1 :
  //       let scorer = new DataElement("Highest Scorer", this.potSize[1]);
  //       this.potSizeArray[1] = scorer;
  //       this.incrementLoadCount();
  //       break;
  //     case 2 :
  //       let bowler = new DataElement("Best Bowler", this.potSize[2]);
  //       this.potSizeArray[2] = bowler;
  //       this.incrementLoadCount();
  //       break;
  //     case 3 :
  //     let mom = new DataElement("Mom", this.potSize[3]);
  //     this.potSizeArray[3] = mom;
  //     this.incrementLoadCount();
  //       break;
  //     case 4 :
  //     let score = new DataElement("Score", this.potSize[4]);
  //     this.potSizeArray[4] = score;
  //     this.incrementLoadCount();
  //       break;
  //     default :
  //     break;
  //   }

  //   // let winner = new DataElement("Winning Team", this.potSize[0]);
  //   // let scorer = new DataElement("Highest Scorer", this.potSize[1]);
  //   // let bowler = new DataElement("Highest Scorer", this.potSize[2]);
  //   // let mom = new DataElement("Highest Scorer", this.potSize[3]);
  //   // let score = new DataElement("Highest Scorer", this.potSize[4]);
    
  //   // this.potSizeArray[0] = winner;
  //   // this.potSizeArray[1] = scorer;
  //   // this.potSizeArray[2] = bowler;
  //   // this.potSizeArray[3] = mom;
  //   // this.potSizeArray[4] = score;

  //   // this.dataSource.data = this.potSizeArray;
  //   // this.potSizeLoaded = true;

  //   // console.log(this.dataSource.data);
  // }

  // incrementLoadCount() {
  //   this.potSizeLoadCount++;

  //   if(this.potSizeLoadCount === 5) {
  //     this.dataSource.data = this.potSizeArray;
  //   }
  // }
}
