import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserApiResp } from '../interfaces/apiReponses.interface';
import { Constants } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  
  baseUrl: string = Constants.DB_API_ENDPOINT;
  http!: HttpClient;

  constructor() {
    this.http = inject(HttpClient)
  }

  registerUser(registerForm: FormGroup): Observable<UserApiResp> {
    return this.http.post<UserApiResp>(`${this.baseUrl}/users`, registerForm.value);
  }


}
