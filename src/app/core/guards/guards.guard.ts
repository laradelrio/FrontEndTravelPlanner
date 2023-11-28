import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserApiService } from '../apiServices/user-api.service';

export const guardsGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const userApiService = inject(UserApiService);

  let isUserAuthorized = await userApiService.setUserAuthorizationStatus();
  
  if(!isUserAuthorized){
    alert('Unauthorized, please Login');
  }
  
  return isUserAuthorized ? true : router.navigate(['/home'])
};