import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, finalize } from 'rxjs';
import { UserApiResp } from '../interfaces/apiResponses.interface';
import { Constants } from '../constants/constants';


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
