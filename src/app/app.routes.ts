import { Routes } from '@angular/router';
import { MainpageComponent } from '@layout/mainpage/mainpage.component';
import { guardsGuard } from './core/guards/guards.guard';
import { TestfeatureComponent } from './features/testfeature/testfeature.component';
import { UserProfileComponent } from '@app/features/user-profile/user-profile.component';



export const routes: Routes = [
    {
        path: 'test',
        component: TestfeatureComponent,
        canActivate: [guardsGuard],
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
                path: 'profile',
                component: UserProfileComponent,
                children: [
                    {
                        path: '',
                        loadComponent : () => 
                            import('@app/features/user-profile/components/user-profile-view/user-profile-view.component').then((m) => m.UserProfileViewComponent)
                    },
                    {
                        path: 'edit',
                        loadComponent : () => 
                            import('@app/features/testfeature/testfeature.component').then((m) => m.TestfeatureComponent)
                    },
                ]
            },
            {
                path: '**',
                loadComponent : () => 
                import('@app/features/home/home.component').then((m) => m.HomeComponent)
            },
        ]
    },
    

];
