import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
// import { AboutComponent } from './about/about.component';

import { WelcomeComponent } from './welcome/welcome.component';

const routes: Route[] = [
    {
        path: '',
        component: WelcomeComponent,
    },
    {
        path: 'about',
        // component: AboutComponent,
        loadComponent: () => import('./about/about.component').then(mod => mod.AboutComponent),
    },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./dashboard/routes').then(mod => mod.DASHBOARD_ROUTES),
        // loadChildren: () =>
        //     import('./dashboard/dashboard-routing.module').then(mod => mod.DashboardRoutingModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
