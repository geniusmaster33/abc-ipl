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
    

    this.fetchDate();
  }

  fetchDate() {

    const fetchDateURL = 'http://abcipl.club:5000/getTime';

    this.http.get(fetchDateURL).subscribe(
      (response) => {
        let currDate;
        currDate = (response.text());
        console.log("Raw date " + (currDate));
        console.log("Date received : " + moment.unix(currDate).format());
        this.fetchMatches(moment.unix(currDate));
      },
      (error) => {
        console.log("Error in getting todays date : " + error);
      },
      () => {

      }
    )
  }

  fetchMatches(currentDate) {
    const url = './../assets/info/match3.json';

    this.http.get(url).subscribe(
      (data) => {
        this.matchList = data.json();
        //console.log("Matches ", this.matchList[0].team1);

        // let currentDate = moment();
        // console.log("Date " + currentDate.format());

        this.todaysMatches = this.matchList.filter(match => (currentDate).isSame(moment(match.date, "DD-MMM-YYYY"), 'day'));
        console.log("Today match ", this.todaysMatches);

        let haltTime = moment([currentDate.year(), currentDate.month(), currentDate.date(), 4+12, 50, 0]);
console.log(haltTime.format());
        if(currentDate.isAfter(haltTime)) {
          console.log("Current date is ahead");
        }

        //console.log(moment(currentDate).isSame('2018-03-21', 'day'));
      }
    )
  }

}
