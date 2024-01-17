import { Routes } from '@angular/router';
import { MainpageComponent } from '@layout/mainpage/mainpage.component';
import { guardsGuard } from './core/guards/guards.guard';
import { UserProfileComponent } from '@app/features/user-profile/user-profile.component';
import { MatchesComponent } from './features/matches/matches.component';



export const routes: Routes = [
    {
        path: '',
        component: MainpageComponent,
        children: [
            {
                path: 'home',
                loadComponent: () =>
                    import('@app/features/home/home.component').then((m) => m.HomeComponent)
            },
            {
                path: 'profile',
                component: UserProfileComponent,
                canActivate: [guardsGuard],
                children: [
                    {
                        path: '',
                        loadComponent: () =>
                            import('@app/features/user-profile/components/user-profile-view/user-profile-view.component').then((m) => m.UserProfileViewComponent)
                    },
                    {
                        path: 'edit',
                        loadComponent: () =>
                            import('@app/features/user-profile/components/user-profile-edit/user-profile-edit.component').then((m) => m.UserProfileEditComponent)
                    },
                ]
            },
            {
                path: 'password',
                children: [
                    {
                        path: 'reset/:token',
                        pathMatch: 'prefix',
                        loadComponent: () =>
                            import('@app/features/password/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
                    },
                    {
                        path: '',
                        loadComponent: () =>
                            import('@app/features/password/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent)
                    },
                ]
            },
            {
                path: 'trips',
                canActivate: [guardsGuard],
                loadComponent: () =>
                    import('@app/features/trips/trips.component').then((m) => m.TripsComponent),
            },
            {
                path: 'trip/edit/:id',
                canActivate: [guardsGuard],
                loadComponent: () =>
                    import('@app/features/trips/components/trip-edit/trip-edit.component').then((m) => m.TripEditComponent)
            },
            {
                path: 'new-trip',
                canActivate: [guardsGuard],
                loadComponent: () =>
                    import('@app/features/trips/components/trip-form/trip-form.component').then((m) => m.TripFormComponent)
            },
            {
                path: 'trip/:id',
                canActivate: [guardsGuard],
                loadComponent: () =>
                    import('@app/features/trips/components/trip-view/trip-view.component').then((m) => m.TripViewComponent)
            },
            {
                path: 'sight',
                children: [
                    {
                        path: 'new/:id',
                        canActivate: [guardsGuard],
                        loadComponent: () =>
                            import('@app/features/sights/new-sight/new-sight.component').then((m) => m.NewSightComponent)
                    },
                    {
                        path: 'edit/:id',
                        canActivate: [guardsGuard],
                        loadComponent: () =>
                            import('@app/features/sights/edit-sight/edit-sight.component').then((m) => m.EditSightComponent)
                    },
                ]
            },
            {
                path: 'matches',
                canActivate: [guardsGuard],
                loadComponent: () =>
                    import('@app/features/matches/matches.component').then((m) => m.MatchesComponent)
            },
            {
                path: '**',
                loadComponent: () =>
                    import('@app/features/home/home.component').then((m) => m.HomeComponent)
            },

        ]
    }

];
