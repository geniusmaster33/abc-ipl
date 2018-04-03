import { Component, OnInit, AfterViewInit, Input, OnChanges } from '@angular/core';
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

  @Input('squads') inputSquads;
  selectedSquads;

  results:Results;

  recentMatches;

  constructor(private http : Http) { 
    this.results = new Results();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedSquads = this.inputSquads;
    console.log('Squadzzzzzzz', this.selectedSquads);
  }


  get diagnostic() { return JSON.stringify(this.results); }

  submitIt() {
  
  }
  
}

class Results {
  scorer = "";
  bowler = "";
  mom = "";
  winner = "";
  score = 0;

  constructor() {}
}



