import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
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
  isDataLoaded:boolean = false;

  //data fields
  tossWinner:string;
  highestScorer:string;
  highestWicketTaker:string;
  matchWinner:string;
  manOfTheMatch:string;
  score:number;

  tossWinnerBet:string;
  highestScorerBet:string;
  highestWicketTakerBet:string;
  matchWinnerBet:string;
  manOfTheMatchBet:string;
  scoreBet:number;

  constructor(private http : Http) { }

  ngOnInit() {
    const url = './../assets/info/teams.json';
    console.log("isDataLoaded" + this.isDataLoaded);

    this.http.get(url).subscribe(
      (data) => {
        this.todaysTeams = data.json().filter(team => team.teamid == 'CSK' || team.teamid == 'DD');
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
    
    switch(action) {
      case 'tossWinnerEvent' :
        this.tossWinner = eventData.target.value;
        console.log("Toss Winner : ", this.tossWinner);
        break;
      case 'highestScorerEvent' :
        this.highestScorer = eventData;
        console.log("Highest Scorer : " + this.highestScorer);
        break;
    }
  }
}
