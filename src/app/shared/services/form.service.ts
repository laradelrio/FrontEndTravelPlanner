import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants } from '@app/core/constants/constants';
import { ImgbbAPIResp } from '@app/core/interfaces/form.interface';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  baseImgBBUrl: string = Constants.IBB_API_URL;
  imgbbApiKey: string = environment.imgbbApiKey;
  http!: HttpClient;

  constructor() {
    this.http = inject(HttpClient);
  }

  uploadImg(imgFile: any): Observable<ImgbbAPIResp> {
    const formData = new FormData();
    formData.append('image', imgFile)
    console.log('here')
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
      }
    }
    return errorMessage;
  }

}
