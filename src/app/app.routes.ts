import { RouterModule, Routes } from '@angular/router';
import { MatchPredictComponent } from './component/match-predict/match-predict.component';
import { HomePageComponent } from './component/home-page/home-page.component';

export const appRoutes : Routes = [
    {path: '', component : HomePageComponent },
    {path: 'matchpredict', component : MatchPredictComponent}
];