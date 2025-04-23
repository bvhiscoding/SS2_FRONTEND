import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MyInfoComponent } from "./my-info.component";

const routes: Routes = [
    {
        path:'',
        component: MyInfoComponent,
        children:[
            {
                path:'',
                redirectTo:'view',
                pathMatch:'full',
            },
            {
                path: 'view',
                loadComponent: () =>
                  import('../my-info/my-info-view/my-info-view.component').then(
                    (m) => m.MyInfoViewComponent
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