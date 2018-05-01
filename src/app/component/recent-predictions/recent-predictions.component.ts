import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../util/web3.service';
import { Http } from '@angular/http';
import * as moment from 'moment';
import * as match_artifact from '../../../../build/contracts/IPLMatch.json';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';
import { Predictions } from '../match-predict/predictions';
import * as _ from 'lodash';


@Component({
  selector: 'app-recent-predictions',
  templateUrl: './recent-predictions.component.html',
  styleUrls: ['./recent-predictions.component.css']
})
export class RecentPredictionsComponent implements OnInit {

  ipl: any;
  match: any;
  matchIndex:number;
  allMatches;
  isMatchesLoaded = false;
  isSquadLoaded = false;
  predictionLoaded = false;

  chosenMatchInfo;
  teamIdNameMap = new Map();
  teamShortNameMap = new Map();
  playerMap = new Map();
  scores30PlusMap = new Map();
  sixesMap = new Map();
  wicketsMap = new Map();

  selectedSquads;

  predictions: Predictions;
  notPredictedFlag = false;

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


  constructor(private web3Service: Web3Service,
              private http : Http) { }

  ngOnInit() {
    this.fetchDate();
    this.loadTeamIdNameMap();
    this.loadTeamShortNames();
    this.loadQuestionsMap();
  }

  loadMatchList(currentDate) {
    const url = './../assets/info/match1.json';
    //currentDate = moment.now();

    this.http.get(url).subscribe(
      (data) => {
        this.allMatches = data.json().filter(match => moment(match.date, "DD-MMM-YYYY").isSameOrBefore((currentDate), 'day'));
        _.reverse(this.allMatches);
        this.allMatches = _.slice(this.allMatches, 0, 7);
      },
      (error) => {
        console.log("Error loading match list");
      },
     () => {
       this.isMatchesLoaded = true;
     }
    )
  }

  handleTeamSelect(selectedValue) {
    console.log("Match selected ", selectedValue);
    //TODO - Add match id
    let chosenMatchInfo = selectedValue.split(":");
    let selectedMatchId = chosenMatchInfo[4]; 

    this.fetchSquads(chosenMatchInfo[0], chosenMatchInfo[1], selectedMatchId);
    
  }

  fetchSquads(team1, team2, matchId) {
    console.log("--" + team1 + "-- --" + team2 + "--");
    const url = './../assets/info/teams1.json';
    this.http.get(url).subscribe(
      (data) => {
        this.selectedSquads = data.json().filter(team => team.name == team1 || team.name == team2);
        this.loadPlayerIdNameMap();
        this.getRecentPredictions(matchId - 1);
        this.getPotSize(matchId - 1);
      },
      (error) => console.log(error),
      () => this.isSquadLoaded = true
    )
  }

  getRecentPredictions(matchIndex) {
    this.predictionLoaded = false;
    this.notPredictedFlag = false;

    this.web3Service.artifactsToContract(ipl_artifact)
      .then((response) => {
        this.ipl = response;
        this.ipl.deployed().then((instance) => {
          instance.getMatchByIndex.call(matchIndex).then((matchAddr) => { //TODO 
            console.log("Match address - ", matchAddr);
            this.web3Service.artifactsToContract(match_artifact)
              .then((m) => {
                console.log("Register preresponse ", m);
                this.match = m;
                this.match.at(matchAddr).then((instance1) => {
                  instance1.getPlayerBet.call(this.web3Service.getKey())
                  //instance1.getPlayerBet.call('0X24F61F4FA30770BE8D1B39063B6DC3D70CAFA953')
                    .then((v) => {
                      
                      let points = v[0];
                      let options = v[1];
                      let totalPoints = v[2];

                      console.log("Options ", options);

                      let optionsAdd = 0;
                      for(let val of options) {
                        optionsAdd += Number(val);
                      }

                      if(optionsAdd == 0) {
                        this.notPredictedFlag = true;
                      } else {
                        this.predictions = new Predictions();

                        this.predictions.winningTeam.prediction = this.getTeamName(options[0].toNumber().toString());
                        this.predictions.winningTeam.assignedPoints = points[0];

                        if(matchIndex < 30 ) {
                          this.predictions.highestScorer.prediction = this.getPlayerName(options[1].toNumber());
                          this.predictions.highestScorer.assignedPoints = points[1];
                          
                          this.predictions.bestBowler.prediction = this.getPlayerName(options[2].toNumber());
                          this.predictions.bestBowler.assignedPoints = points[2];
  
                          this.predictions.mom.prediction = this.getPlayerName(options[3].toNumber());
                          this.predictions.mom.assignedPoints = points[3];
                        }
                        else {
                          this.predictions.score30Plus.prediction = this.scores30PlusMap.get(options[1].toNumber());
                          this.predictions.score30Plus.assignedPoints = points[1];

                          this.predictions.sixes.prediction = this.sixesMap.get(options[2].toNumber());
                          this.predictions.sixes.assignedPoints = points[2];

                          this.predictions.wickets.prediction = this.wicketsMap.get(options[3].toNumber());
                          this.predictions.wickets.assignedPoints = points[3];

                        }

                        
                        this.predictions.score.prediction = options[4].toNumber();
                        this.predictions.score.assignedPoints = points[4];
                        
                        this.predictionLoaded = true;
                      }

                      //console.log("notPredictedFlag " + this.notPredictedFlag);

                      Number(options[0]) 
                      
                      

                    });
                });
              })
          })
        })
      }
      );
  }

  fetchDate() {

    const fetchDateURL = 'http://abcipl.club:5000/getTime';
    let currDate;

    this.http.get(fetchDateURL).subscribe(
      (response) => {
        
        currDate = (response.text());
        // console.log("Raw date " + (currDate));
        // console.log("Date received : " + moment.unix(currDate).format());
        //this.fetchMatches(moment.unix(currDate));
      },
      (error) => {
        console.log("Error in getting todays date : " + error);
      },
      () => {
        this.loadMatchList(moment.unix(currDate));
      }
    )
  }

  


  loadTeamIdNameMap() {
    this.teamIdNameMap.set('1', 'Chennai Super Kings');
    this.teamIdNameMap.set('2', 'Delhi Daredevils');
    this.teamIdNameMap.set('3', 'Kings XI Punjab');
    this.teamIdNameMap.set('4', 'Kolkata Knight Riders');
    this.teamIdNameMap.set('5', 'Mumbai Indians');
    this.teamIdNameMap.set('6', 'Rajasthan Royals');
    this.teamIdNameMap.set('7', 'Royal Challengers Bangalore');
    this.teamIdNameMap.set('8', 'Sunrisers Hyderabad');
  }

  loadTeamShortNames() {
    this.teamShortNameMap.set('Chennai Super Kings', 'CSK');
    this.teamShortNameMap.set('Delhi Daredevils', 'DD');
    this.teamShortNameMap.set('Kings XI Punjab', 'KXIP');
    this.teamShortNameMap.set('Kolkata Knight Riders', 'KKR');
    this.teamShortNameMap.set('Mumbai Indians', 'MI');
    this.teamShortNameMap.set('Rajasthan Royals', 'RR');
    this.teamShortNameMap.set('Royal Challengers Bangalore', 'RCB');
    this.teamShortNameMap.set('Sunrisers Hyderabad', 'SRH');
  }

  loadPlayerIdNameMap() {

    this.playerMap = null;
    this.playerMap = new Map();

    for(let team of this.selectedSquads) {
      for(let player of team.squad) {
        this.playerMap.set(Number(player.pid), player.pname);
      }
    }
  }

  loadQuestionsMap() {
    this.scores30PlusMap.set(1, 'Less than 4');
    this.scores30PlusMap.set(2, '4');
    this.scores30PlusMap.set(3, 'More than 4');

    this.sixesMap.set(1, '0 - 10');
    this.sixesMap.set(2, '11 - 17');
    this.sixesMap.set(3, 'More than 17');

    this.wicketsMap.set(1, '0 - 9');
    this.wicketsMap.set(2, '10 - 12');
    this.wicketsMap.set(3, '13 - 15');
    this.wicketsMap.set(4, 'More than 15');
  }

  getTeamName(id) {
    return this.teamIdNameMap.get(id);
  }

  getTeamShortName(name) {
    return this.teamShortNameMap.get(name);
  }

  getPlayerName(id) {
    return this.playerMap.get(id);
  }

  getPotSize(matchIndex) {
    this.predictionLoaded = false;
    this.notPredictedFlag = false;

    console.log("Trying to fetch pot sizes");

    this.web3Service.artifactsToContract(ipl_artifact)
      .then((response) => {
        this.ipl = response;
        this.ipl.deployed().then((instance) => {
          instance.getMatchByIndex.call(matchIndex).then((matchAddr) => { //TODO 
            console.log("qPot Match address - ", matchAddr);
            this.web3Service.artifactsToContract(match_artifact)
              .then((m) => {
                console.log("qPot Register preresponse ", m);
                this.match = m;
                this.match.at(matchAddr).then((instance1) => {
                  instance1.totalPot.call()
                    .then((v) => {
                      
                      console.log("Total ", v);

                    });
                });
              })
          })
        })
      }
      );
  }

  get diagnostic() { return JSON.stringify(this.predictions); }

}
