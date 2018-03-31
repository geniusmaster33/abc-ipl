import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  selectedSquads;

  results:Results;

  recentMatches;

  isMatchesLoaded:boolean = false;
  isSquadLoaded:boolean = false;

  constructor(private http : Http) { 
    this.results = new Results();
  }

  ngOnInit() {
    this.loadMatchList();

    //jQuery('ul').tabs();

    console.log("Element", jQuery('.tabs'));
          
  }

  loadMatchList() {
    const url = './../assets/info/match.json';

    this.http.get(url).subscribe(
      (data) => {
        this.allMatches = data.json();
        console.log("Matchlist ", this.allMatches);
      },
      (error) => {
        console.log("Error loading match list");
      },
     () => {
       this.isMatchesLoaded = true;
       console.log("Loaded " + this.isMatchesLoaded);
     }
    )
  }

  handleTeamSelect(selectedValue) {
    console.log("Match selected ", selectedValue);
    //TODO - Add match id
    let teamNames = selectedValue.split(":");
    this.fetchSquads(teamNames[0], teamNames[1]);
  }

  fetchSquads(team1, team2) {
    console.log("--" + team1 + "-- --" + team2 + "--");
    const url = './../assets/info/teams.json';
    this.http.get(url).subscribe(
      (data) => {
        console.log("Data ", data);
        this.selectedSquads = data.json().filter(team => team.name == team1 || team.name == team2);
        this.selectedSquads[0].id = "1";
        console.log("Squad ", this.selectedSquads);
      },
      (error) => console.log(error),
      () => this.isSquadLoaded = true
    )
  }

  get diagnostic() { return JSON.stringify(this.results); }
}

class Results {
  scorer = "";
  bowler = "";
  mom = "";
  winner = "";
  score = 0;

  constructor() {}
}


