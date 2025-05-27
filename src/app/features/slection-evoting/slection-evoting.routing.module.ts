import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SlectionEvotingComponent } from "./slection-evoting.component";

const routes: Routes = [
    {
        path:'',
        component: SlectionEvotingComponent,
        children:[
            {
                path:'',
                redirectTo:'list',
                pathMatch:'full',
            },
            {
                path: 'list',
                loadComponent: () =>
                  import('../slection-evoting/slection-evoting-list/slection-evoting-list.component').then(
                    (m) => m.SlectionEvotingListComponent
                  ),        
            },
            {
                path: 'result/:id',
                loadComponent: () =>
                  import('../slection-evoting/result-evoting/result-evoting.component').then(
                    (m) => m.ResultEvotingComponent
                  ),        
            },
            {
                path:"**",
                redirectTo:'/',
            },
        ],
    },
];

@NgModule({
    imports:[RouterModule.forChild(routes), TranslateModule],
    exports:[RouterModule],
})
export class SlectionEvotingRoutingModule {}