import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomePageComponent} from './home-page/home-page.component';
import {MatchInfoComponent} from './match-info/match-info.component';
import {UtilModule} from '../util/util.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UtilModule
  ],
  declarations: [
    HomePageComponent,
    MatchInfoComponent
    ],
  exports: [
    HomePageComponent,
    MatchInfoComponent
  ]
})
export class MetaModule {
}
