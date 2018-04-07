import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';
import { Web3Service } from '../../util/web3.service';
import * as metacoin_artifacts from '../../../../build/contracts/MetaCoin.json';
import * as eip20_artifact from '../../../../build/contracts/EIP20.json';
import * as ipl_artifact from '../../../../build/contracts/Ipl.json';
import * as registration_artifact from '../../../../build/contracts/Registration.json';

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
  Regn: any;

  model = {
    username: '',
    fullname: '',
    key: '',
    isMLTeam: false
  }

  isError = false;
  errorMsg = 'Error encountered';

  submitInProgress = false;

  constructor(private route: ActivatedRoute,
    private http: Http,
    private router: Router,
    private web3Service: Web3Service) { }

  ngOnInit() {
    this.model.key = this.route.snapshot.paramMap.get('key');
    this.submitInProgress = false;
  }

  checkUserName() {
    console.log("CheckUSerName is progress ");
    const url = 'http://abcipl.club:4020/checkusername?username=';
    this.isError = false;
    this.http.get(url + this.model.username).subscribe(
      (data) => {
        if(data.text() !== 'Welcome') {
          console.log('Entered if');
          this.isError = true;
          this.errorMsg = 'User Name already exists !!!';
          this.submitInProgress = false;
        }
        else {
          console.log('Entered else');
          this.checkKey();
        }
      },
      (error) => {
        console.log("Response code :  " + error.status);
      }
    )
  }

  checkKey() {
    const url = 'http://abcipl.club:4020/getName?pk=';
    this.http.get(url + this.model.key).subscribe(
      (data) => {

        if(data.text() !== 'Welcome') {
          this.isError = true;
          this.errorMsg = 'Public Key already exists !!!';
          this.submitInProgress = false;
        }
        else {
          this.registerInContract();
        }
      },
      (error) => {
        console.log("Response code :  " + error.status);
      }
    )
  }

  submitForm() {
    const url = 'http://abcipl.club:4020/login';

    console.log("About to submit");

    this.http.post(url, this.model).subscribe(
      (data) => {
        console.log("Account registered with login service");
        //this.registerInContract();
        this.router.navigate(['']);
      },
      (error) => {
        console.log("Response code :  " + error.status);
      }
    )
  }

  registerInContract() {
    this.submitInProgress = true;
    console.log("About to register");
    this.web3Service.artifactsToContract(registration_artifact)
      .then((response) => {
        console.log("Register preresponse ", response);
        this.Regn = response;
        this.Regn.deployed().then((instance) => {
          instance.addPlayer.sendTransaction(this.model.key, 
                                             this.model.username,
                                             (this.model.isMLTeam === true ? 1 : 0), 
                                             { from: this.model.key, gas: 300000 }).then((v) => {
            console.log("Add player response - " + v);
            if (v) { 
              this.submitForm();
            }
          });
        },
          (e) => { });
      })
  }
}
