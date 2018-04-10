import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';
import * as match_artifact from '../../../../build/contracts/IPLMatch.json';
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

  constructor(private web3Service: Web3Service) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedSquads = this.inputSquads;
    this.selectedMatchId = this.inputMatchId;
    this.selectedMatchTime = this.inputMatchTime;
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
                                                       { from: this.web3Service.getKey(), gas: 500000, gasPrice: 20000000000 })
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
  

}
