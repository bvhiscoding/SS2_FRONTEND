import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { TranslateModule } from '@ngx-translate/core';
import { RolesGuard } from '../../core/guards/roles.guard';
// import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'statistical',
        pathMatch: 'full',
      },
      {
        path: 'statistical',
        loadChildren: () =>
          import('../../features/statistical/statistical.routing.module').then(
            (m) => m.StatisticalRoutingModule,
          ),
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('../../features/management/management.routing.module').then(
            (m) => m.ManagementRoutingModule,
          ),
          canActivate: [RolesGuard],
      },
      {
        path: 'level-management',
        loadChildren: () =>
          import('../../features/level-management/level-management.routing.module').then(
            (m) => m.LevelManagementRoutingModule,
          ),
          canActivate: [RolesGuard],
      },
       {
        path: 'slection-management',
        loadChildren: () =>
          import('../../features/slection-management/slection-management.routing.module').then(
            (m) => m.SlectionManagementRoutingModule,
          ),
          canActivate: [RolesGuard],
      },
      {
        path: 'slection-ticket',
        loadChildren: () =>
          import('../../features/slection-evoting/slection-evoting.routing.module').then(
            (m) => m.SlectionEvotingRoutingModule,
          ),
      },
      {
        path: 'slection-follow',
        loadChildren: () =>
          import('../../features/slection-follow/slection-follow.routing.module').then(
            (m) => m.SlectionFollowRoutingModule,
          ),
      },
      {
        path: 'user-infor/:id',
        loadChildren: () =>
          import('../../features/my-info/my-info.routing.module').then(
            (m) => m.ManagementRoutingModule,
          ),
      },
      {
        path: 'setting',
        loadChildren: () =>
          import('../../features/setting/setting.routing.module').then(
            (m) => m.SettingRoutingModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TranslateModule],
  exports: [RouterModule],
})
export class MainRoutingModule {}
