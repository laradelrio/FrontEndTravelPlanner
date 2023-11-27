import { effect, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserApiService } from '../apiServices/user-api.service';
import { HomeComponent } from '@app/features/home/home.component';
import { HeaderComponent } from '@app/layout/mainpage/header/header.component';

export const guardsGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const userApiService = inject(UserApiService);

  let isUserAuthorized = await userApiService.setUserAuthorizationStatus();
  
  if(!isUserAuthorized){
    alert('Unauthorized, please Login');
  }
  
  return isUserAuthorized ? true : router.navigate(['/home'])
};