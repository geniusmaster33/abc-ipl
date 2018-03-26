import { RouterModule, Routes } from '@angular/router';
import { MatchPredictComponent } from './component/match-predict/match-predict.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { MatchResultComponent } from './component/match-result/match-result.component';

export const appRoutes : Routes = [
    {path: '', component : HomePageComponent },
    {path: 'matchpredict/:teams', component : MatchPredictComponent},
    {path: 'matchresult', component : MatchResultComponent}
];