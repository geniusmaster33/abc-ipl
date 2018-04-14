import { Component, OnInit } from '@angular/core';
import * as eip20_artifact from '../../../../build/contracts/EIP20.json';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';
import * as registration_artifact from '../../../../build/contracts/Registration.json';
import { Http } from '@angular/http';
import { Leader } from './leader';
import { Web3Service } from '../../util/web3.service';
import { FilterPipe } from './../pipes/filterpipe';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {

  leadersList;
  aiLeadersList;
  Regn: any;

  leaders: Leader[];
  userNameMap = new Map();
  myRank: number;

  allSearchTerm: string;
  aiSearchTerm: string;

  constructor(private web3Service: Web3Service, private http:Http) { }

  ngOnInit() {
    //this.leadersList = this.getLeaderBoard();
    
    //this.getLeaderBoardData();
    this.createKeyToNameMap();
  }

  
  getAILeaders() {
    return this.leaders.filter((leader) => (leader.category == 1));
  }

  getLeaderBoardData() {
    console.log("Inside function");
    this.web3Service.artifactsToContract(registration_artifact)
      .then((response) => {
        this.Regn = response;
        this.Regn.deployed().then((instance) => {
          // console.log("Regn contract ------- ", instance);
          instance.getLeaderBoard.call().then((v) => {
            console.log("LeaderBoard Details", v);
            this.leadersList = v; // Contract sends 3 different arrays
            let keys = this.leadersList[0];
            let balances = this.leadersList[1];
            let categories = this.leadersList[2];

            this.leaders = new Array(keys.length);

            // console.log('Inside leader board - map contents ', this.userNameMap);

            for(let index = 0; index < keys.length; index++) {
              let ldr = new Leader();
              ldr.key = keys[index].toLowerCase();
              ldr.balance = balances[index];
              ldr.category = categories[index];

              ldr.name = this.userNameMap.get(ldr.key.toLowerCase());
              // console.log("From map for [" + ldr.key + "]", this.userNameMap.get(ldr.key));

              this.leaders[index] = ldr;

            }
            this.leaders.sort(this.sortLeaderBoard);

            // for(let index = 0; index < this.leaders.length; index++) {
            //   if(this.leaders[index].key.toLowerCase() == this.web3Service.getKey().toLowerCase()) {
            //     this.myRank = index + 1;
            //     console.log("RANKkkkkkkk " + this.myRank);
            //   }
            // }

            this.evaluateRank();

            console.log(this.leaders);

            this.aiLeadersList = this.getAILeaders();
            this.evaluateAIRank();
          });
        },
          (e) => { });
      })
  }

  sortLeaderBoard(obj1:Leader, obj2:Leader) {
    if(Number(obj1.balance) < Number(obj2.balance)) {
      return 1;
    } 
    else if(Number(obj1.balance) > Number(obj2.balance)) {
      return -1;
    }
    else {
      return 0;
    }
  }

  evaluateRank() {
    let leaders = this.leaders;
    let rank = 1;
    leaders[0].rank = rank;

    for(let i = 1; i < leaders.length; i++) {
      // if balance not same as previous then increment rank
      if(Number(leaders[i].balance) !== Number(leaders[i - 1].balance)) {
        rank++;
      }
      leaders[i].rank = rank
    }
  }

  evaluateAIRank() {
    let leaders: Leader[] = this.aiLeadersList;
    
    let aiRank = 1;
    leaders[0].aiRank = aiRank;

    for(let i = 1; i < leaders.length; i++) {
      // if balance not same as previous then increment rank
      if(Number(leaders[i].balance) != Number(leaders[i - 1].balance)) {
        aiRank++;
      }
      leaders[i].aiRank = aiRank
    }
  }

  createKeyToNameMap() {
    const url = 'http://abcipl.club:4030/getuserspk';

    this.http.get(url).subscribe(
      (response) => {
        let responseText = response.json();

        for (let user of responseText) {
          this.userNameMap.set(user.key.toLowerCase(), user.name);
        }
      },
      (error) => {
        console.log("Error in getting users list : " + error);
      },
      () => {
        this.getLeaderBoardData();
      }
    )
    
  }

  searchAll(searchTerm: string) {
    console.log("Search term " + searchTerm);
  }
}
