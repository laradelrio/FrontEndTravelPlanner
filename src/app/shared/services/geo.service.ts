import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SightSearchSuggestions } from '@app/core/interfaces/geo.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  private http!: HttpClient;
  private userLocation?: [number, number] ;

  constructor() {
    this.http = inject(HttpClient);
  }

  //get address options to fill form
  getAddressOptions(url: string): Observable<SightSearchSuggestions[]> {
    return this.http.get<SightSearchSuggestions[]>(url);
  }

  async getCurrentUserLocation(): Promise<[number, number]>{
    return new Promise ((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        ({coords}) => {
          this.userLocation = [ coords.longitude, coords.latitude ];
          resolve([ coords.longitude, coords.latitude ]);
        },
        (err) => {
          alert('Not geolocation obtained');
          reject;
        }
      )

    })
  }

}
