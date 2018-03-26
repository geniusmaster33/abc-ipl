import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Predictions } from './predictions';
import { PredictionData} from './prediction-data';

import * as moment from 'moment';

import * as $ from 'jquery/dist/jquery.min.js';

declare var jQuery:any;

@Component({
  selector: 'app-match-predict',
  templateUrl: './match-predict.component.html',
  styleUrls: ['./match-predict.component.css']
})
export class MatchPredictComponent implements OnInit{
  todaysTeams;
  teamNames;
  isDataLoaded:boolean = false;

  counter = 0;

  allPredictions:Predictions;

  totalBalance:number = 10000; //TODO - Needs to be fetched from server

  remainingBalance:number = 5000;

  tempBet:number = 250;
  temp2:number;

  constructor(private http : Http,  private route: ActivatedRoute) { }

  ngOnInit() {
    this.allPredictions = new Predictions();
    //this.allPredictions.bestBowler = new PredictionData();
    //this.allPredictions.highestScorer = new PredictionData();

    //this.allPredictions.highestScorer.assignedPoints = 200;
    //this.allPredictions.bestBowler.prediction = "CSK1";

    console.log("Predictions ", this.allPredictions.highestScorer.assignedPoints);
    console.log("isDataLoaded" + this.isDataLoaded);

    this.findTeamNames();
    this.fetchSquads();
    //this.remainingBalance = 5000 - this.allPredictions.bestBowler.assignedPoints;
  }

  findTeamNames() {
    const teamNamesFromURL = this.route.snapshot.paramMap.get('teams');
    this.teamNames = teamNamesFromURL.split("-");
    console.log("######## Team names : " + this.teamNames[0] + " - " + this.teamNames[1]);

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

  handleEvent(eventData, action:string) {
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

  evaluateRemainingBalance(eventData) {
    console.log("%%%%%%%%%%%% " + eventData);
    this.remainingBalance = 5000 - this.allPredictions.highestScorer.assignedPoints;
    console.log("rem bal " + this.allPredictions.highestScorer.assignedPoints + " " + this.remainingBalance);
  }

  get diagnostic() { return JSON.stringify(this.allPredictions); }

  get getBalance() {
    this.counter++;
    console.log("getBalance - " + this.counter);
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
}
