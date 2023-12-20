import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
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
        next: (res) => (this.isLoggedIn.set(false)),
        error: (error) => (this.isLoggedIn.set(true))
      })
  }

  getUser(userId: number): Observable<UserApiResp>{
    return this.http.get<UserApiResp>(`${this.baseUrl}/users/${userId}`, { withCredentials: true });
  }

  updateUser(userId: number, update: {}): Observable<UserApiResp>{
    return this.http.put<UserApiResp>(`${this.baseUrl}/users/update/${userId}`, update, { withCredentials: true });
  }

  

}
