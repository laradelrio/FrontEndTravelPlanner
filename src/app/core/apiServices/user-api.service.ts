import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserApiResp } from '../interfaces/apiResponses.interface';
import { Constants } from '../constants/constants';
import { HeaderComponent } from '@app/layout/mainpage/header/header.component';


@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  
  baseUrl: string = Constants.DB_API_ENDPOINT;
  http!: HttpClient;
  isLoggedIn = signal<boolean>(false); 

  constructor() {
    this.http = inject(HttpClient)
  }

  registerUser(registerForm: FormGroup): Observable<UserApiResp> {
    return this.http.post<UserApiResp>(`${this.baseUrl}/users`, registerForm.value);
  }

  loginUser(loginForm: FormGroup): Observable<UserApiResp> {
    return this.http.post<UserApiResp>(`${this.baseUrl}/users/byEmail`, loginForm.value, {withCredentials: true});
  }

  isUserAuthorized(): Observable<UserApiResp> {
    return this.http.post<UserApiResp>(`${this.baseUrl}/users/token`, {}, { withCredentials: true });
  }
  
  setUserAuthorizationStatus(){
    return new Promise ((resolve, reject) => {
    try{
      this.isUserAuthorized().subscribe({
        next: (res) => (this.isLoggedIn.set(true), resolve(true), console.log('ress',res)),
        error: (error) => (this.isLoggedIn.set(false), resolve(false), console.log('err', error))
      })
    }catch(error){
      console.log('reject');
      reject(false);
    }
      
   } )
  }

  logoutUser(): Observable<UserApiResp> {
    return this.http.post<UserApiResp>(`${this.baseUrl}/users/logout`, {}, { withCredentials: true });
  }

  logout(){
    this.logoutUser()
    .subscribe({
      next: (res) => (this.isLoggedIn.set(false)),
      error: (error) => (this.isLoggedIn.set(true))
    })
  }

}
