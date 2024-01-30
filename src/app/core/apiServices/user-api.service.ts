import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { GetUserApiResp, UserApiResp } from '../interfaces/apiResponses.interface';
import { Constants } from '../constants/constants';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class UserApiService {

  baseUrl: string = Constants.DB_API_ENDPOINT;
  http!: HttpClient;
  isLoggedIn = signal<boolean>(false);
  router: Router = inject(Router);
  openLogin = signal(1);

  constructor() {
    this.http = inject(HttpClient);
  }

  registerUser(registerForm: FormGroup): Observable<UserApiResp> {
    return this.http.post<UserApiResp>(`${this.baseUrl}/users`, registerForm.value);
  }

  loginUser(loginForm: FormGroup): Observable<UserApiResp> {
    return this.http.post<UserApiResp>(`${this.baseUrl}/users/byEmail`, loginForm.value, { withCredentials: true });
  }

  isUserAuthorized(): Observable<UserApiResp> {
    return this.http.post<UserApiResp>(`${this.baseUrl}/users/token`, {}, { withCredentials: true });
  }

  setUserAuthorizationStatus() {
    return new Promise((resolve, reject) => {
      try {
        this.isUserAuthorized().subscribe({
          next: (res) => (this.isLoggedIn.set(true), resolve(true)),
          error: (error) => (this.isLoggedIn.set(false), resolve(false))
        })
      } catch (error) {
        reject(false);
      }
    })
  }

  logoutUser(): Observable<UserApiResp> {
    return this.http.post<UserApiResp>(`${this.baseUrl}/users/logout`, {}, { withCredentials: true });
  }

  logout() {
    this.logoutUser()
      .subscribe({
        next: (res) => (this.isLoggedIn.set(false), localStorage.clear, this.router.navigate(['/home'])),
        error: (error) => (this.isLoggedIn.set(true))
      })
  }

  getUser(userId: number): Observable<GetUserApiResp>{
    return this.http.get<GetUserApiResp>(`${this.baseUrl}/users/${userId}`, { withCredentials: true });
  }

  updateUser(userId: number, update: {}): Observable<UserApiResp>{
    return this.http.put<UserApiResp>(`${this.baseUrl}/users/update/${userId}`, update, { withCredentials: true });
  }

  deleteUser(userId: number){
    return this.http.delete<UserApiResp>(`${this.baseUrl}/users/delete/${userId}`, { withCredentials: true });
  }

  sendEmailChangePassword(email: string): Observable<UserApiResp>{
    return this.http.post<UserApiResp>(`${this.baseUrl}/users/sendResetPasswordEmail`,  {email: email});
  }

  isEmailRegistered(email: string): Observable<UserApiResp>{
    return this.http.post<UserApiResp>(`${this.baseUrl}/users/isRegisteredEmail`, {email: email});
  }

  changePassword(resetPasswordForm:FormGroup): Observable<UserApiResp>{
    return this.http.post<UserApiResp>(`${this.baseUrl}/users/resetPassword`, resetPasswordForm.value);
  }

  openLoginModal(){
    this.openLogin.set(2);
  }
}
