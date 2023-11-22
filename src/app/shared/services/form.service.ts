import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }
  
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
