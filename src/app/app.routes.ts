import { RouterModule, Routes } from '@angular/router';
import { MatchPredictComponent } from './component/match-predict/match-predict.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { MatchResultComponent } from './component/match-result/match-result.component';
import { MatchAdminComponent } from './component/match-admin/match-admin.component';
import { LeaderBoardComponent } from './component/leader-board/leader-board.component';

export const appRoutes : Routes = [
    {path: '', component : HomePageComponent },
    {path: 'matchpredict/:teams', component : MatchPredictComponent},
    {path: 'matchresult', component : MatchResultComponent},
    {path: 'special', component : MatchAdminComponent},
    {path: 'leader', component : LeaderBoardComponent}
];