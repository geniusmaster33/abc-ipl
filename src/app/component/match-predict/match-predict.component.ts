import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-match-predict',
  templateUrl: './match-predict.component.html',
  styleUrls: ['./match-predict.component.css']
})
export class MatchPredictComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  updateRange(event) {
    console.log("Inside updateRange ", event.target.value);
  }

}
