import { Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';
import { Http } from '@angular/http';
import * as moment from 'moment';

declare var jQuery:any;

@Component({
  selector: 'app-match-result',
  templateUrl: './match-result.component.html',
  styleUrls: ['./match-result.component.css']
})
export class MatchResultComponent implements OnInit {

  allMatches;

  @Input('squads') inputSquads;
  selectedSquads;

  results:Results;

  recentMatches;

  constructor(private http : Http) { 
    this.results = new Results();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedSquads = this.inputSquads;
    console.log('Squadzzzzzzz', this.selectedSquads);
  }


  get diagnostic() { return JSON.stringify(this.results); }

  submitIt() {
  
  }

  // submitPredictions() {
  //   console.log("About to predict");
  //   this.web3Service.artifactsToContract(ipl_artifact)
  //     .then((response) => {
  //       //console.log("Register preresponse ", response);
  //       this.ipl = response;
  //       this.ipl.deployed().then((instance) => {
  //         instance.getMatchByIndex.call(this.matchIndex).then((matchAddr) => { //TODO 
  //           console.log("Match address - ", matchAddr);
  //           this.web3Service.artifactsToContract(match_artifact)
  //             .then((m) => {
  //               console.log("Register preresponse ", m);
  //               this.match = m;
  //               this.match.at(matchAddr).then((instance1) => {
  //                 instance1.bet.sendTransaction([this.allPredictions.winningTeam.assignedPoints,
  //                                               this.allPredictions.highestScorer.assignedPoints, 
  //                                               this.allPredictions.bestBowler.assignedPoints,
  //                                               this.allPredictions.mom.assignedPoints,
  //                                               this.allPredictions.score.assignedPoints], 
  //                                               [ this.allPredictions.winningTeam.prediction, 
  //                                                 this.allPredictions.highestScorer.prediction, 
  //                                                this.allPredictions.bestBowler.prediction, 
  //                                                this.allPredictions.mom.prediction,
  //                                                this.allPredictions.score.prediction],
  //                   { from: this.web3Service.getKey(), gas: 500000, gasPrice: 20000000000 })
  //                   .then((v) => {
  //                     console.log("Match Predict result - " + v);
  //                     if (v) { // If not registered
  //                     }
  //                   });
  //               });
  //             })
  //         })
  //       })
  //     }
  //     );
  // }
  
}

class Results {
  scorer = "";
  bowler = "";
  mom = "";
  winner = "";
  score = 0;

  constructor() {}
}



