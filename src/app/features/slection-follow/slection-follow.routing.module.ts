import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SlectionFollowComponent } from "./slection-follow.component";

const routes: Routes = [
    {
        path:'',
        component: SlectionFollowComponent,
        children:[
            {
                path:'',
                redirectTo:'list',
                pathMatch:'full',
            },
            {
                path: 'list',
                loadComponent: () =>
                  import('../slection-follow/slection-follow-list/slection-follow-list.component').then(
                    (m) => m.SlectionFollowListComponent
                  ),        
            },
            {
                path: 'detail/:id',
                loadComponent: () =>
                  import('../slection-follow/slection-follow-list/slection-follow-detail/slection-follow-detail.component').then(
                    (m) => m.SlectionFollowDetailComponent
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
export class SlectionFollowRoutingModule {}