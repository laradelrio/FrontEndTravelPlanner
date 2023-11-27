import { Routes } from '@angular/router';
import { AuthComponent } from '@layout/auth/auth.component';
import { MainpageComponent } from '@layout/mainpage/mainpage.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { guardsGuard } from './core/guards/guards.guard';


export const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: 'login',
                loadComponent : () => 
                    import('@app/features/auth/login/login.component').then((m) => m.LoginComponent),
                canActivate: [guardsGuard],
            },
            {
                path: 'register',
                loadComponent : () => 
                    import('@app/features/auth/register/register.component').then((m) => m.RegisterComponent),
                canActivate: [guardsGuard],
            },
        ]
    },
    {
        path: 'route',
        component: ModalComponent,
    },
    {
        path: '',
        component: MainpageComponent,
        children: [
            {
                path: 'home',
                loadComponent : () => 
                    import('@app/features/home/home.component').then((m) => m.HomeComponent)
            },
            {
                path: '**',
                loadComponent : () => 
                import('@app/features/home/home.component').then((m) => m.HomeComponent)
            },
        ]
    },
    

];
