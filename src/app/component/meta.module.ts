import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomePageComponent} from './home-page/home-page.component';
import {MatchInfoComponent} from './match-info/match-info.component';
import {UtilModule} from '../util/util.module';
import {RouterModule} from '@angular/router';
import { MatchResultComponent } from './match-result/match-result.component';
import { FormsModule }   from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UtilModule,
    FormsModule
  ],
  declarations: [
    HomePageComponent,
    MatchInfoComponent,
    MatchResultComponent
    ],
  exports: [
    HomePageComponent,
    MatchInfoComponent
  ]
})
export class MetaModule {
}
