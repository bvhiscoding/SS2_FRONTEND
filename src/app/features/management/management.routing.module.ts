import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { ManagementComponent } from "./management.component";

const routes: Routes = [
    {
        path:'',
        component: ManagementComponent,
        children:[
            {
                path:'',
                redirectTo:'list',
                pathMatch:'full',
            },
            {
                path: 'list',
                loadComponent: () =>
                  import('../management/management-list/management-list.component').then(
                    (m) => m.ManagementListComponent
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
export class ManagementRoutingModule {}