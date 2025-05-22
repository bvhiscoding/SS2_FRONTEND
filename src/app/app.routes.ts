import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { MainComponent } from './layouts/main/main.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./layouts/main/main.routing.module').then(
        (m) => m.MainRoutingModule,
      ),
    canActivate: [AuthGuard],
  },
];
