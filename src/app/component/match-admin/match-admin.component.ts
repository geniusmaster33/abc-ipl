import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import * as moment from 'moment';


@Component({
  selector: 'app-match-admin',
  templateUrl: './match-admin.component.html',
  styleUrls: ['./match-admin.component.css']
})
export class MatchAdminComponent implements OnInit {
  allMatches;
  selectedSquads;

  selectedMatchId;
  selectedMatchDateTime;

  //results:Results;

  recentMatches;

  isMatchesLoaded:boolean = false;
  isSquadLoaded:boolean = false;

  constructor(private http : Http) { 
    //this.results = new Results();
  }

  ngOnInit() {
    this.loadMatchList();

    //jQuery('ul').tabs();

          
  }

  loadMatchList() {
    const url = './../assets/info/match1.json';

    this.http.get(url).subscribe(
      (data) => {
        this.allMatches = data.json();
        console.log("Matchlist ", this.allMatches);

        // let i = 1;
        // for(let match of this.allMatches) {
        //   match.id = i;
        //   i++;
        // }

        //console.log("Update match list", JSON.stringify(this.allMatches));
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
    let matchInfo = selectedValue.split(":");
    this.fetchSquads(matchInfo[0], matchInfo[1]);
    this.selectedMatchDateTime = matchInfo[2] + " @ " + matchInfo[3];
    this.selectedMatchId = matchInfo[4]; 
    console.log("Date time ------- " + this.selectedMatchDateTime);
  }

  fetchSquads(team1, team2) {
    console.log("--" + team1 + "-- --" + team2 + "--");
    const url = './../assets/info/teams1.json';
    this.http.get(url).subscribe(
      (data) => {
        console.log("Data ", data);
        this.selectedSquads = data.json().filter(team => team.name == team1 || team.name == team2);
        //this.selectedSquads[0].id = "1";
        console.log("Squad ", this.selectedSquads);
      },
      (error) => console.log(error),
      () => this.isSquadLoaded = true
    )
  }

  submitIt() {
  
  }
  
//  get diagnostic() { return JSON.stringify(this.results); }
}
