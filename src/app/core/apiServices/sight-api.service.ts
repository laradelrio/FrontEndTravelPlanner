import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Constants } from '../constants/constants';
import { NewSight } from '../interfaces/sight.interface';
import { ApiResp } from '../interfaces/apiResponses.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SightApiService {

  baseUrl: string = Constants.DB_API_ENDPOINT;
  http!: HttpClient;

  constructor() {
    this.http = inject(HttpClient);
  }

  getSights(tripId: number): Observable<ApiResp>{
    return this.http.get<ApiResp>(`${this.baseUrl}/sights/trip/${tripId}`)
  }

  addNewSight(sight: NewSight): Observable<ApiResp>{
    return this.http.post<ApiResp>(`${this.baseUrl}/sights/`, sight, { withCredentials: true });
  }

  updateSight(sightId: number, update: {}): Observable<ApiResp>{
    return this.http.put<ApiResp>(`${this.baseUrl}/sights/update/${sightId}`, update, { withCredentials: true });
  }
}
