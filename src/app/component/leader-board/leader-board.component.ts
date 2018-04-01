import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {

  leadersList;
  aiLeadersList;

  constructor() { }

  ngOnInit() {
    this.leadersList = this.getLeaderBoard();
    this.aiLeadersList = this.getAILeaders();
  }

  getLeaderBoard() {
    let leaders = [{
      "name": "Apple",
      "points": 2000,
      "wl": "5:3",
      "category": "man"
    },
    {
      "name": "Boy",
      "points": 1800,
      "wl": "5:4",
      "category": "man"
    },
    {
      "name": "Apple",
      "points": 2000,
      "wl": "5:3",
      "category": "machine"
    },
    {
      "name": "Apple",
      "points": 2000,
      "wl": "5:3",
      "category": "man"
    },
    {
      "name": "Apple",
      "points": 2000,
      "wl": "5:3",
      "category": "man"
    },
    {
      "name": "Apple",
      "points": 2000,
      "wl": "5:3",
      "category": "man"
    },
  ];

  return leaders;
  }

  getAILeaders() {
    return this.leadersList.filter((leader) => (leader.category === 'machine'));
  }

}
