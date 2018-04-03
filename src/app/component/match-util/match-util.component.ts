import { Component, OnInit, Input, OnChanges } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedSquads = this.inputSquads;
    this.selectedMatchId = this.inputMatchId;
    this.selectedMatchTime = this.inputMatchTime;
  }

  stopPrediction() {
    // Add code to submit stop prediction request
  }

  submitIt() {
  
  }
  

}
