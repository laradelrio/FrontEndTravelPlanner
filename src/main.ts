/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import mapboxgl from 'mapbox-gl'; 
import { environment } from 'environments/environment.development';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

mapboxgl.accessToken = environment.mapBoxApiKey;

if (!navigator.geolocation){
  alert('Browser incompatible with Geolocation');
  throw new Error('Browser incompatible with Geolocation');
}