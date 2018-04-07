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

  constructor(private web3Service: Web3Service, private http:Http) { }

  ngOnInit() {
    //this.leadersList = this.getLeaderBoard();
    this.aiLeadersList = this.getAILeaders();
    this.getLeaderBoardData();
  }

  
  getAILeaders() {
    //return this.leadersList.filter((leader) => (leader.category === 'machine'));
  }

  getLeaderBoardData() {
    console.log("Inside function");
    this.web3Service.artifactsToContract(registration_artifact)
      .then((response) => {
        this.Regn = response;
        this.Regn.deployed().then((instance) => {
          console.log("Regn contract ------- ", instance);
          instance.getLeaderBoard.call().then((v) => {
            console.log("LeaderBoard Details", v);
            this.leadersList = v;
            let names = this.leadersList[0];
            let balances = this.leadersList[1];

            this.leaders = new Array(names.length);

            for(let index = 0; index < names.length; index++) {
              let ldr = new Leader();
              ldr.name = names[index];
              ldr.balance = balances[index];
              this.leaders[index] = ldr;
            }
            // this.leaders[0].balance = 100;
            // this.leaders[1].balance = 190;
            // this.leaders[2].balance = 20;
            // this.leaders[3].balance = 40;
            // this.leaders[4].balance = 10;
             this.leaders.sort(this.sortLeaderBoard);

            console.log(this.leaders);

            this.getUserName();
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

  async getUserName() {
    const url = 'http://abcipl.club:4030/getuserspk';

    let leaders = [{
      "name": "Apple",
      "key" : "lkajsdljkajdskl"
    },
    {
      "name": "Boy",
    }
  ];


    this.http.get(url).subscribe(
      (response) => {
        console.log("Raw response " + response.text());
        let responseText = "[" + response.json() + "]";
        // this.model.username = response.text();

        let slipts
        console.log("Response text - ", responseText);

        // for(let user of leaders) {
        //     console.log("Name " + );
        //     //this.userNameMap.set(user[0], user[1]);
        //   }
      },
      (error) => {
        console.log("Error in getting todays date : " + error);
      },
      () => {

      }
    )
    // let usernames = await this.http.get(url).toPromise();
    // console.log('User name from python ', usernames.text());

    // console.log(JSON.parse(usernames.text()));
    
    // .forEach(user => {
    //    this.userNameMap.set(user[0], user[1]);
    //  });

    // for(let user of usernames) {
    //   console.log(user);
    //   //this.userNameMap.set(user[0], user[1]);
    // }

    // console.log('Usernames List', this.userNameMap  );
  }
}
