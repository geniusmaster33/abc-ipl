import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as moment from 'moment';


@Component({
  selector: 'app-match-info',
  templateUrl: './match-info.component.html',
  styleUrls: ['./match-info.component.css']
})

export class MatchInfoComponent implements OnInit {

  matchList;
  todaysMatches;

  constructor(private http : Http) { }

  ngOnInit() {
    const url = './../assets/info/match.json';

    this.http.get(url).subscribe(
      (data) => {
        this.matchList = data.json();
        console.log("Matches ", this.matchList[0].team1);

        let currentDate = moment();
        console.log("Date " + currentDate.format());

        this.todaysMatches = this.matchList.filter(match => moment(currentDate).isSame(moment(match.date, "DD-MMM-YYYY"), 'day'));
        console.log("Today match ", this.todaysMatches);

        console.log(moment(currentDate).isSame('2018-03-21', 'day'));
      }
    )
  }

}
