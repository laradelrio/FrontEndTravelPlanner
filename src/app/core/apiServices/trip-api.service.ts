import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Constants } from '../constants/constants';
import { Observable } from 'rxjs';
import { ApiResp, UserApiResp } from '../interfaces/apiResponses.interface';
import { Trip } from '../interfaces/trip.interface';

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
    return this.http.get<ApiResp>(`${this.baseUrl}/trips/user/${userId}`, { withCredentials: true });
  }

  getAllTripMatches(trip: Trip): Observable<ApiResp> {
    let userId = localStorage.getItem('userId');
    return this.http.post<ApiResp>(`${this.baseUrl}/trips/matches/${userId}`, trip, { withCredentials: true });
  }
  

}
