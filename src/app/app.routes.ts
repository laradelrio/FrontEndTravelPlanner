import { Routes } from '@angular/router';
import { AuthComponent } from '@layout/auth/auth.component';
import { MainpageComponent } from '@layout/mainpage/mainpage.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: 'login',
                loadComponent : () => 
                    import('@app/features/auth/login/login.component').then((m) => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent : () => 
                    import('@app/features/auth/register/register.component').then((m) => m.RegisterComponent)
            },
        ]
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
    }

];
