import { Routes } from '@angular/router';
import { MainpageComponent } from '@layout/mainpage/mainpage.component';
import { guardsGuard } from './core/guards/guards.guard';
import { TestfeatureComponent } from './features/testfeature/testfeature.component';
import { UserProfileComponent } from '@app/features/user-profile/user-profile.component';
import { MatchesComponent } from './features/matches/matches.component';



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
                canActivate: [guardsGuard],
                children: [
                    {
                        path: '',
                        loadComponent : () => 
                            import('@app/features/user-profile/components/user-profile-view/user-profile-view.component').then((m) => m.UserProfileViewComponent)
                    },
                    {
                        path: 'edit',
                        loadComponent : () => 
                            import('@app/features/user-profile/components/user-profile-edit/user-profile-edit.component').then((m) => m.UserProfileEditComponent ) 
                    },
                ]
            },
            {
                path: 'new-trip',
                canActivate: [guardsGuard],
                loadComponent : () => 
                import('@app/features/trip-form/trip-form.component').then((m) => m.TripFormComponent)
            },
            {
                path: 'trip/:id',
                canActivate: [guardsGuard],
                loadComponent : () => 
                import('@app/features/trip-view/trip-view.component').then((m) => m.TripViewComponent)
            },
            {
                path: 'matches',
                canActivate: [guardsGuard],
                loadComponent : () => 
                import('@app/features/matches/matches.component').then((m) => m.MatchesComponent)
            },
            {
                path: '**',
                loadComponent : () => 
                import('@app/features/home/home.component').then((m) => m.HomeComponent)
            },
        ]
    }    

];
