import { HttpClient } from '@angular/common/http';
import { Injectable, Input, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants } from '@app/core/constants/constants';
import { CitiesRes, ImgbbAPIResp } from '@app/core/interfaces/form.interface';
import { PhotoRes } from '@app/core/interfaces/photo.interface';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  baseImgBBUrl: string = Constants.IBB_API_URL;
  imgbbApiKey: string = environment.imgbbApiKey;
  baseCountriesCitiesUrl: string = Constants.COUNTRIES_CITIES_API;
  unsplashApiUrl: string = Constants.UNSPLASH_API;
  unsplashClientId: string = environment.unsplashClientID
  http!: HttpClient;

  constructor() {
    this.http = inject(HttpClient);
  }

  uploadImg(imgFile: any): Observable<ImgbbAPIResp> {
    const formData = new FormData();
    formData.append('image', imgFile);
    return this.http.post<ImgbbAPIResp>(this.baseImgBBUrl, formData, { params: { key: this.imgbbApiKey } })
  }
    
  getInputError(input: string, form: FormGroup): string{
    let errors =  form.controls[input].errors  || {};   
    let errorMessage: string = ""

    for(let error of Object.keys(errors)){
      switch(error){
        case 'required':
          errorMessage = "Required field";
          break;
        case 'email':
          errorMessage = 'Please enter a valid email';
          break;
        case 'minlength':
          errorMessage = `Must have at least ${errors['minlength']['requiredLength']} characters`;
          break;
        case 'maxlength':
          console.log('error',errors)
          errorMessage = `Maximum ${errors['maxlength']['requiredLength']} characters`;
          break;
      }
    }
    return errorMessage;
  }

  getCitiesInCountry(country: string): Observable<CitiesRes>{
    return this.http.post<CitiesRes>(this.baseCountriesCitiesUrl, {"country": country}) 
  }

  getPlaceImage(place: string):Observable<PhotoRes>{
    return this.http.get<PhotoRes>(`${this.unsplashApiUrl}${place}&client_id=${this.unsplashClientId}`)
  }
}
