import { Component, OnInit } from '@angular/core';
import * as eip20_artifact from '../../../../build/contracts/EIP20.json';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';
import * as registration_artifact from '../../../../build/contracts/Registration.json';
import { Http } from '@angular/http';
import { Leader } from './leader';
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

  leaders: Leader[];
  userNameMap = new Map();
  myRank: number;

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


              if(ldr.key.toLowerCase() == this.web3Service.getKey().toLowerCase()) {
                this.myRank = index + 1;
                console.log("RANKkkkkkkk " + this.myRank);
              }

              ldr.name = this.userNameMap.get(ldr.key.toLowerCase());
              // console.log("From map for [" + ldr.key + "]", this.userNameMap.get(ldr.key));

              this.leaders[index] = ldr;

            }
            // this.leaders[0].balance = 100;
            // this.leaders[1].balance = 190;
            // this.leaders[2].balance = 20;
            // this.leaders[3].balance = 40;
            // this.leaders[4].category = 1;
            this.leaders.sort(this.sortLeaderBoard);

            console.log(this.leaders);

            this.aiLeadersList = this.getAILeaders();
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
}
