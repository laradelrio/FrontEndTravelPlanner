import { HttpClient } from '@angular/common/http';
import { Injectable, Input, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants } from '@app/core/constants/constants';
import { CitiesRes, ImgbbAPIResp } from '@app/core/interfaces/form.interface';
import { ModalInfo } from '@app/core/interfaces/modal.interface';
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
  unsplashClientId: string = environment.unsplashClientID;
  http!: HttpClient;

  constructor() {
    this.http = inject(HttpClient);
  }

  uploadImg(imgFile: any): Observable<ImgbbAPIResp> {
    const formData = new FormData();
    formData.append('image', imgFile);
    return this.http.post<ImgbbAPIResp>(this.baseImgBBUrl, formData, { params: { key: this.imgbbApiKey } })
  }

  getInputError(input: string, form: FormGroup): string {
    let errors = form.controls[input].errors || {};
    let errorMessage: string = ""


    for (let error of Object.keys(errors)) {
      switch (error) {
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
          errorMessage = `Maximum ${errors['maxlength']['requiredLength']} characters`;
          break;
        case 'invalidDate':
          errorMessage = `Date not within trip dates`;
          break;
        case 'isSamePassword':
          errorMessage = `Passwords don't match`;
          break;
      }
    }
    return errorMessage;
  }

  getCitiesInCountry(country: string): Observable<CitiesRes> {
    return this.http.post<CitiesRes>(this.baseCountriesCitiesUrl, { "country": country })
  }

  getPlaceImage(place: string): Observable<PhotoRes> {
    return this.http.get<PhotoRes>(`${this.unsplashApiUrl}${place}&client_id=${this.unsplashClientId}`)
  }

  getPlacePhotoUrl(place: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getPlaceImage(place)
        .subscribe((res) => {
          resolve(res.results[0].urls.raw)
        })
    })
  };  

  getDeleteModalInfo(deletedElement: string): ModalInfo{
    let modalInfo: ModalInfo = {
      style: "modal-style-danger",
      title: `Delete ${deletedElement}`,
      body: `Deleting ${deletedElement} is permanent. Are you sure you want to delete ${deletedElement}?`,
      btnClass: "btn-danger",
      closeBtnName: "Cancel",
      actionBtnName: "Delete",
    }
    return modalInfo;
  }

  getSuccessModalInfo(element: string, body: string): ModalInfo{
    let modalInfo: ModalInfo = {
        style: "modal-style-primary",
        title: `${element} successfully`,
        body: `${body}`,
        btnClass: "btn-blue",
        closeBtnName: "",
        actionBtnName: "Okay",
    }
    return modalInfo;
  }

}
