import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Constants } from '../constants/constants';
import { Observable } from 'rxjs';
import { ApiResp, UserApiResp } from '../interfaces/apiResponses.interface';

@Injectable({
  providedIn: 'root'
})
export class TripApiService {

  baseUrl: string = Constants.DB_API_ENDPOINT;
  http!: HttpClient;

  constructor() {
    this.http = inject(HttpClient);
  }

  getAllUserTrips(userId: number): Observable<ApiResp> {
    return this.http.get<ApiResp>(`${this.baseUrl}/trips/user/4`, { withCredentials: true });
  }

}
