import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { MatchInfoComponent } from './component/match-info/match-info.component';
import { MatchPredictComponent } from './component/match-predict/match-predict.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    MatchInfoComponent,
    MatchPredictComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }) // <-- debugging purposes only)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
