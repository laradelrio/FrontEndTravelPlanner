import { Routes } from '@angular/router';
import { MainpageComponent } from '@layout/mainpage/mainpage.component';
import { guardsGuard } from './core/guards/guards.guard';
import { TestfeatureComponent } from './features/testfeature/testfeature.component';


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
                path: '**',
                loadComponent : () => 
                import('@app/features/home/home.component').then((m) => m.HomeComponent)
            },
        ]
    },
    

];
