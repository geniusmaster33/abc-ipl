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

  q30PlusOptions = [
    {
      "displayTxt": "Less than 40",
      "value": "1"
    },
    {
      "displayTxt": "40 - 50",
      "value": "2"
    },
    {
      "displayTxt": "More than 50",
      "value": "3"
    }];

  qSixesOptions = [
    {
      "displayTxt": "Less than 70",
      "value": "1"
    },
    {
      "displayTxt": "70 - 90",
      "value": "2"
    },
    {
      "displayTxt": "More than 90",
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

  constructor(private http : Http,
              private web3Service: Web3Service) { 
    this.results = new Results();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedSquads = this.inputSquads;
    this.selectedMatchId = this.inputMatchId;
    console.log('Squadzzzzzzz', this.selectedSquads);
  }


  get diagnostic() { return JSON.stringify(this.results); }

  submitResults() {
    console.log("About to predict");
    this.web3Service.artifactsToContract(ipl_artifact)
      .then((response, error) => {
        console.log("ipl_artifact preresponse ", response);
        console.log("ipl_artifact error ", response);
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
                                                this.results.score30plus, 
                                                this.results.sixes,
                                                this.results.wickets,
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

  submitIt() {

    console.log("Match Id : " + this.selectedMatchId);
    console.log("Results ", this.results);

    this.web3Service.artifactsToContract(ipl_artifact)
      .then((response) => {
        //console.log("Register preresponse ", response);
        this.ipl = response;
        this.ipl.deployed().then((instance) => {
          instance.getMatchByIndex.call(this.selectedMatchId - 1).then((matchAddr) => { //TODO 
            console.log("Match address - ", matchAddr);
            this.web3Service.artifactsToContract(match_artifact)
              .then((m) => {
                this.match = m;
                console.log("Results ", this.results);
                this.match.at(matchAddr).then((instance1) => {
                  instance1.calculateWinLoss.sendTransaction([Number(this.results.winner),
                                                              Number(this.results.score30plus), 
                                                                Number(this.results.sixes),
                                                                  Number(this.results.wickets),
                                                                    this.results.score],
                                                              { from: this.web3Service.getKey(), gas: 6000000, gasPrice: 5000000000 })
                    .then((v) => {
                      console.log("Match end submission status - " + v);
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
  score30plus = "";
  sixes = "";
  wickets = "";
  winner = "";
  score = 0;

  constructor() {}
}



