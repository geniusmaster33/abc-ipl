import { Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';
import { Http } from '@angular/http';
import * as moment from 'moment';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';
import * as match_artifact from '../../../../build/contracts/IPLMatch.json';
import { Web3Service } from '../../util/web3.service';

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

  @Input('matchId') inputMatchId;
  selectedMatchId;

  results:Results;

  recentMatches;

  ipl: any;
  match: any;

  constructor(private http : Http,
              private web3Service: Web3Service) { 
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

  submitResults() {
    console.log("About to predict");
    this.web3Service.artifactsToContract(ipl_artifact)
      .then((response) => {
        //console.log("Register preresponse ", response);
        this.ipl = response;
        this.ipl.deployed().then((instance) => {
          instance.getMatchByIndex.call(this.selectedMatchId - 1).then((matchAddr) => { //TODO 
            console.log("Match address - ", matchAddr);
            this.web3Service.artifactsToContract(match_artifact)
              .then((m) => {
                console.log("Register preresponse ", m);
                this.match = m;
                this.match.at(matchAddr).then((instance1) => {
                  instance1.calculateWinLoss.sendTransaction([this.results.winner,
                                                this.results.scorer, 
                                                this.results.bowler,
                                                this.results.mom,
                                                this.results.score],
                    { from: this.web3Service.getKey(), gas: 500000, gasPrice: 20000000000 })
                    .then((v) => {
                      console.log("Result submission status - " + v);
                    });
                });
              })
          })
        })
      }
      );
  }
  
}

class Results {
  scorer = "";
  bowler = "";
  mom = "";
  winner = "";
  score = 0;

  constructor() {}
}



