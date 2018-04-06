import { Component, OnInit } from '@angular/core';
import * as eip20_artifact from '../../../../build/contracts/EIP20.json';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';
import * as registration_artifact from '../../../../build/contracts/Registration.json';
import { Web3Service } from '../../util/web3.service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {

  leadersList;
  aiLeadersList;
  Regn: any;

  names;
  balances;

  constructor(private web3Service: Web3Service) { }

  ngOnInit() {
    this.leadersList = this.getLeaderBoard();
    this.aiLeadersList = this.getAILeaders();
    this.getLeaderBoardData();
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

  getLeaderBoardData() {
    this.web3Service.artifactsToContract(registration_artifact)
      .then((response) => {
        this.Regn = response;
        this.Regn.deployed().then((instance) => {
          console.log("Regn contract ------- ", instance);
          instance.getLeaderBoard.call().then((v) => {
            console.log("LeaderBoard Details", v);
            this.leadersList = v;
            this.names = this.leadersList[0];
            this.balances = this.leadersList[1];

            console.log(this.names);


            
          });
        },
          (e) => { });
      })
  }
}
