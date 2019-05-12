import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';
import * as match_artifact from '../../../../build/contracts/IPLMatch.json';
import * as registration_artifact from '../../../../build/contracts/Registration.json';
import { Web3Service } from '../../util/web3.service';

@Component({
  selector: 'app-match-util',
  templateUrl: './match-util.component.html',
  styleUrls: ['./match-util.component.css']
})
export class MatchUtilComponent implements OnInit {

  @Input('squads') inputSquads;
  selectedSquads;

  @Input('matchId') inputMatchId;
  selectedMatchId;

  @Input('matchTime') inputMatchTime;
  selectedMatchTime;

  ipl: any;
  match: any;
  Regn: any;

  isResultSubmitted;
  isEndMatch;

  constructor(private web3Service: Web3Service) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedSquads = this.inputSquads;
    this.selectedMatchId = this.inputMatchId;
    this.selectedMatchTime = this.inputMatchTime;

    this.getMatchStatus();
  }

  
  stopPrediction(flag:boolean) {
    console.log("About to toggle halt " + flag);
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
                this.match.at(matchAddr).then((instance1) => {
                  instance1.haltSwitch.sendTransaction(flag,
                                                       { from: this.web3Service.getKey(), gas: 500000, gasPrice: 5000000000 })
                    .then((v) => {
                      console.log("Match halt submission status - " + v);
                    });
                });
              })
          })
        })
      }
      );
  }


  endMatch() {
    console.log("About to end match ");
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
                this.match.at(matchAddr).then((instance1) => {
                  instance1.endMatch.sendTransaction(  { from: this.web3Service.getKey(), gas: 500000, gasPrice: 5000000000 })
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

  refreshLeaderBoard() {
    console.log("About to register");
    this.web3Service.artifactsToContract(registration_artifact)
      .then((response) => {
        console.log("Register preresponse ", response);
        this.Regn = response;
        this.Regn.deployed().then((instance) => {
          instance.getPlayerDetail.sendTransaction( 
                                             { from: this.web3Service.getKey(), gas: 300000 }).then((v) => {
            console.log("Add player response - " + v);
            
          });
        },
          (e) => { });
      })
  }

  getMatchStatus() {

    console.log("Getting match status");

    this.web3Service.artifactsToContract(ipl_artifact)
      .then((response) => {
        // console.log("Response " + response);
        this.ipl = response;
        this.ipl.deployed().then((instance) => {
          instance.getMatchByIndex.call(this.selectedMatchId - 1).then((matchAddr) => { //TODO 
            // console.log("qPot Match address - ", matchAddr);
            this.web3Service.artifactsToContract(match_artifact)
              .then((m) => {
                // console.log("qPot Register preresponse ", m);
                this.match = m;
                this.match.at(matchAddr).then((instance1) => {
                  instance1.calculateWinLost.call()
                    .then((v) => {
                      this.isResultSubmitted = String(v).toUpperCase();
                      console.log("Result sibmit status " + this.isResultSubmitted);
                    });
                });
              })
          })
        })
      }
      );

      this.web3Service.artifactsToContract(ipl_artifact)
      .then((response) => {
        this.ipl = response;
        this.ipl.deployed().then((instance) => {
          instance.getMatchByIndex.call(this.selectedMatchId - 1).then((matchAddr) => { //TODO 
            console.log("qPot Match address - ", matchAddr);
            this.web3Service.artifactsToContract(match_artifact)
              .then((m) => {
                // console.log("qPot Register preresponse ", m);
                this.match = m;
                this.match.at(matchAddr).then((instance1) => {
                  instance1.matchEnd.call()
                    .then((v) => {
                      this.isEndMatch = String(v).toUpperCase();
                      console.log("End match status " + this.isEndMatch);
                    });
                });
              })
          })
        })
      }
      );
  }
  

}
