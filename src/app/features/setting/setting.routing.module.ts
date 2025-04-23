import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SettingComponent } from "./setting.component";

const routes: Routes = [
    {
        path:'',
        component: SettingComponent,
        children:[
            {
                path:'',
                redirectTo:'',
                pathMatch:'full',
            },
            {
                path: 'change-password',
                loadComponent: () =>
                  import('../setting/change-password/change-password.component').then(
                    (m) => m.ChangePasswordComponent
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
export class SettingRoutingModule {}