import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { LevelManagementComponent } from "./level-management.component";

const routes: Routes = [
    {
        path:'',
        component: LevelManagementComponent,
        children:[
            {
                path:'',
                redirectTo:'list',
                pathMatch:'full',
            },
            {
                path: 'list',
                loadComponent: () =>
                  import('../level-management/level-management-list/level-management-list.component').then(
                    (m) => m.LevelManagementListComponent
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
export class LevelManagementRoutingModule {}