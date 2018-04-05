import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';
import { Web3Service } from '../../util/web3.service';
import * as metacoin_artifacts from '../../../../build/contracts/MetaCoin.json';
import * as eip20_artifact from '../../../../build/contracts/EIP20.json';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // regModel = {
  //   id: string,

  // }
  Ipl: any;

  model = {
    username: '',
    fullname: '',
    key: ''
  }
  constructor(private route: ActivatedRoute,
    private http: Http,
    private router: Router,
    private web3Service: Web3Service) { }

  ngOnInit() {
    this.model.key = this.route.snapshot.paramMap.get('key');
  }


  submitForm() {
    const url = 'http://abcipl.club:4020/login';

    console.log("About to submit");

    this.http.post(url, this.model).subscribe(
      (data) => {
        console.log("Account registered with login service");
        this.registerInContract();
        //this.router.navigate(['']);
        // this.matchList = data.json();
        // console.log("Matches ", this.matchList[0].team1);

        // // let currentDate = moment();
        // // console.log("Date " + currentDate.format());

        // this.todaysMatches = this.matchList.filter(match => (currentDate).isSame(moment(match.date, "DD-MMM-YYYY"), 'day'));
        // console.log("Today match ", this.todaysMatches);

        //console.log(moment(currentDate).isSame('2018-03-21', 'day'));
      },
      (error) => {
        console.log("Response code :  " + error.status);
      }
    )
  }

  registerInContract() {
    console.log("About to register");
    this.web3Service.artifactsToContract(ipl_artifact)
      .then((response) => {
        console.log("Register preresponse ", response);
        this.Ipl = response;
        this.Ipl.deployed().then((instance) => {
          instance.addPlayer.sendTransaction(this.model.key, this.model.username, { from: this.model.key, gas: 300000 }).then((v) => {
            console.log("Add player response - " + v);
            if (v) { // If not registered
              this.router.navigate(['']);
            }
          });
        },
          (e) => { });
      })
  }
}
