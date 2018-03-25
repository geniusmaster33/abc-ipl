import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import {MetaModule} from './component/meta.module';
//import { MatchInfoComponent } from './component/match-info/match-info.component';
import { MatchPredictComponent } from './component/match-predict/match-predict.component';


@NgModule({
  declarations: [
    AppComponent,
    MatchPredictComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MetaModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }) // <-- debugging purposes only)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
