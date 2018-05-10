import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';

import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import {MetaModule} from './component/meta.module';
//import { MatchInfoComponent } from './component/match-info/match-info.component';
import { MatchPredictComponent } from './component/match-predict/match-predict.component';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { FusionChartsModule } from 'angular4-fusioncharts';

FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme);

@NgModule({
  declarations: [
    AppComponent,
    MatchPredictComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    MetaModule,
    RouterModule.forRoot(appRoutes/*, { enableTracing: true }*/) ,// <-- debugging purposes only)
    FusionChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
