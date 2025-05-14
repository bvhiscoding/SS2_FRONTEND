import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SlectionManagementComponent } from "./slection-management.component";

const routes: Routes = [
    {
        path:'',
        component: SlectionManagementComponent,
        children:[
            {
                path:'',
                redirectTo:'list',
                pathMatch:'full',
            },
            {
                path: 'list',
                loadComponent: () =>
                  import('../slection-management/slection-management-list/slection-management-list.component').then(
                    (m) => m.SlectionManagementListComponent
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
export class SlectionManagementRoutingModule {}