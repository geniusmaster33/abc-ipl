import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../util/web3.service';
import { Http } from '@angular/http';
import * as moment from 'moment';
import * as match_artifact from '../../../../build/contracts/IPLMatch.json';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';
import { Predictions } from '../match-predict/predictions';
import { DataElement } from "./../model/DataElement";
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
  id = 'chart1';
  type = 'doughnut2d';
  dataFormat = 'json';
  dataSource;

  potSizeArray : DataElement[] = new Array(5);
  potSizeLoadCount = 0;


  constructor(private web3Service: Web3Service,
              private http : Http) { }

  ngOnInit() {
    this.fetchDate();
    this.loadTeamIdNameMap();
    this.loadTeamShortNames();
    this.loadQuestionsMap();

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
          "formatNumberScale": "0",
          "legendIconScale": "1.5"
      },
      "data": []
    }
  }

  loadMatchList(currentDate) {
    const url = './../assets/info/match3.json';
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
    this.potSizeLoadCount = 0;
    console.log("Match selected ", selectedValue);
    //TODO - Add match id
    
    let chosenMatchInfo = selectedValue.split(":");
    let selectedMatchId = chosenMatchInfo[5]; 
    this.matchIndex = selectedMatchId - 1;

    this.fetchSquads(chosenMatchInfo[0], chosenMatchInfo[1], selectedMatchId);

    for(let i = 0; i < 5; i++) {
      this.getPotSize(i);
    }
    
  }

  fetchSquads(team1, team2, matchId) {
    console.log("--" + team1 + "-- --" + team2 + "--");
    const url = './../assets/info/teams1.json';
    this.http.get(url).subscribe(
      (data) => {
        this.selectedSquads = data.json().filter(team => team.name == team1 || team.name == team2);
        this.loadPlayerIdNameMap();
        this.getRecentPredictions(matchId - 1);
        //this.getPotSize(matchId - 1);
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
                  //instance1.getPlayerBet.call('0xa191eeae0cb9c552eed796d35cfadeacf64fb6ff')
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
    this.teamIdNameMap.set('1', 'Uruguay');
    this.teamIdNameMap.set('2', 'France');
    this.teamIdNameMap.set('3', 'Brazil');
    this.teamIdNameMap.set('4', 'Mexico');
    this.teamIdNameMap.set('5', 'Belgium');
    this.teamIdNameMap.set('6', 'Japan');
    this.teamIdNameMap.set('7', 'Spain');
    this.teamIdNameMap.set('8', 'Russia');
    this.teamIdNameMap.set('9', 'Croatia');
    this.teamIdNameMap.set('10', 'Denmark');
    this.teamIdNameMap.set('11', 'Swizerland');
    this.teamIdNameMap.set('12', 'Sweden');
    this.teamIdNameMap.set('13', 'Colombia');
    this.teamIdNameMap.set('14', 'England');
  }

  loadTeamShortNames() {
    this.teamShortNameMap.set( 'Uruguay',"UG");
    this.teamShortNameMap.set( 'France','FR');
    this.teamShortNameMap.set( 'Brazil','BRZ');
    this.teamShortNameMap.set( 'Mexico','MX');
    this.teamShortNameMap.set( 'Belgium','BG');
    this.teamShortNameMap.set( 'Japan','JPN');
    this.teamShortNameMap.set( 'Spain','SPN');
    this.teamShortNameMap.set(  'Russia','RUS');
    this.teamShortNameMap.set( 'Croatia','CRO');
    this.teamShortNameMap.set(  'Denmark','DEN');
    this.teamShortNameMap.set( 'Swizerland','SWZ');
    this.teamShortNameMap.set( 'Sweden','SWE');
    this.teamShortNameMap.set( 'Colombia','COL');
    this.teamShortNameMap.set(  'England','ENG');
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

    this.sixesMap.set(1, '0 - 2');
    this.sixesMap.set(2, '3 - 5');
    this.sixesMap.set(3, 'More than 5');

    this.wicketsMap.set(1, '0 - 7');
    this.wicketsMap.set(2, '8 - 13');
    this.wicketsMap.set(3, '14 - 18');
    this.wicketsMap.set(4, 'More than 18');
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
             //   console.log("qPot Register preresponse ", m);
                this.match = m;
                this.match.at(matchAddr).then((instance1) => {
                  instance1.qPot.call(index)
                    .then((v) => {
                      //this.potSize[index] = v;
                      console.log("Pot["+ index + "] = " + Number(v));

                     // if(index == 4) {
                        this.setPotSizeArrayForChart(index, v);
                      //}
                    });
                });
              })
          })
        })
      }
      );
  }

  get diagnostic() { return JSON.stringify(this.predictions); }
  setPotSizeArrayForChart(index, value) {

    console.log("setpotsize called for" + index );

    switch(index) {
      case 0 :
        let winner = new DataElement("Winning Team", value, "#F26522");
        this.potSizeArray[0] = winner;
        this.incrementLoadCount();
        break;
      case 1 :
        let scorer30 = new DataElement("Yellow Card", value, "#ADD5D7");
        this.potSizeArray[1] = scorer30;
        this.incrementLoadCount();
        break;
      case 2 :
        let sixes = new DataElement("Goals", value, "#676766");
        this.potSizeArray[2] = sixes;
        this.incrementLoadCount();
        break;
      case 3 :
      let wickets = new DataElement("Fouls", value, "#FFCD33");
      this.potSizeArray[3] = wickets;
      this.incrementLoadCount();
        break;
      case 4 :
      let score = new DataElement("Winning Team POSSESSION", value, "#47ACB1");
      this.potSizeArray[4] = score;
      this.incrementLoadCount();
        break;
      default :
      break;
    }

    // let winner = new DataElement("Winning Team", this.potSize[0]);
    // let scorer = new DataElement("Highest Scorer", this.potSize[1]);
    // let bowler = new DataElement("Highest Scorer", this.potSize[2]);
    // let mom = new DataElement("Highest Scorer", this.potSize[3]);
    // let score = new DataElement("Highest Scorer", this.potSize[4]);
    
    // this.potSizeArray[0] = winner;
    // this.potSizeArray[1] = scorer;
    // this.potSizeArray[2] = bowler;
    // this.potSizeArray[3] = mom;
    // this.potSizeArray[4] = score;

    // this.dataSource.data = this.potSizeArray;
    // this.potSizeLoaded = true;

    // console.log(this.dataSource.data);
  }

  incrementLoadCount() {
    this.potSizeLoadCount++;
    console.log("Load count " + this.potSizeLoadCount);

    if(this.potSizeLoadCount === 5) {
      this.dataSource.data = this.potSizeArray;

      console.log(this.dataSource);
    }
  }

}
