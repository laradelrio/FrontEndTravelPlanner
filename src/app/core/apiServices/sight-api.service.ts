import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Constants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class SightApiService {

  baseUrl: string = Constants.DB_API_ENDPOINT;
  http!: HttpClient;

  constructor() {
    this.http = inject(HttpClient);
  }
}
