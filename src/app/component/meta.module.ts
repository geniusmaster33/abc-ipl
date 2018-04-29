import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomePageComponent} from './home-page/home-page.component';
import {MatchInfoComponent} from './match-info/match-info.component';
import {UtilModule} from '../util/util.module';
import {RouterModule} from '@angular/router';
import { MatchResultComponent } from './match-result/match-result.component';
import { FormsModule }   from '@angular/forms';
import { MatchAdminComponent } from './match-admin/match-admin.component';
import { MatchUtilComponent } from './match-util/match-util.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { LoginComponent } from './login/login.component';
import { RecentPredictionsComponent } from './recent-predictions/recent-predictions.component';
import { FilterPipe } from './pipes/filterpipe'

import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';
import { FusionChartsModule } from 'angular4-fusioncharts';

FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme);

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UtilModule,
    FormsModule,
    FusionChartsModule
  ],
  declarations: [
    HomePageComponent,
    MatchInfoComponent,
    MatchResultComponent,
    MatchAdminComponent,
    MatchUtilComponent,
    LeaderBoardComponent,
    LoginComponent,
    RecentPredictionsComponent,
    FilterPipe
    ],
  exports: [
    HomePageComponent,
    MatchInfoComponent
  ]
})
export class MetaModule {
}
