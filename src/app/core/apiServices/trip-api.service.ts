import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Constants } from '../constants/constants';
import { Observable } from 'rxjs';
import { ApiResp, UserApiResp } from '../interfaces/apiResponses.interface';
import { NewTrip, Trip } from '../interfaces/trip.interface';
import { FormGroup } from '@angular/forms';

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

  getOneTrip(tripId:number): Observable<ApiResp>{
    return this.http.get<ApiResp>(`${this.baseUrl}/trips/${tripId}`, { withCredentials: true });
  }

  addNewTrip(trip: NewTrip): Observable<ApiResp>{
    return this.http.post<ApiResp>(`${this.baseUrl}/trips/`, trip, { withCredentials: true });
  }
  
  updateTrip(tripId: number, update: {}): Observable<ApiResp>{
    return this.http.put<ApiResp>(`${this.baseUrl}/trips/update/${tripId}`, update, { withCredentials: true });
  }

  deleteTrip(tripId: number){
    return this.http.delete<ApiResp>(`${this.baseUrl}/trips/delete/${tripId}`, { withCredentials: true });
  }

}
