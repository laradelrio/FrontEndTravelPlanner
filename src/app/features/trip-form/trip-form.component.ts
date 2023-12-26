import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryDropdownComponent } from '@app/shared/components/country-dropdown/country-dropdown.component';
import { DateInputComponent } from '@app/shared/components/date-input/date-input.component';
import { FormService } from '@app/shared/services/form.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CountryDropdownComponent, DateInputComponent],
  templateUrl: './trip-form.component.html',
  styleUrl: './trip-form.component.scss'
})
export class TripFormComponent {

startLabel: string = 'start';
endLabel: string = 'end'
private formService: FormService = inject(FormService);
tripForm: FormGroup;

constructor(
  private fb: FormBuilder,
){
  this.tripForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    fk_users_id: [localStorage.getItem('userId')],
    destination: this.fb.group({ 
      country: ['',[Validators.required]],
      city: ['',[Validators.required]]
    }) ,
    dates: this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    }),
    photo: ['']
  })
}

  get destinationFromGroup(): FormGroup{
    return this.tripForm.get('destination') as FormGroup
  }

  get datesFromGroup(): FormGroup{
    return this.tripForm.get('dates') as FormGroup
  }

  onSubmit(){
    this.tripForm.markAllAsTouched();
    if(this.tripForm.valid){
      this.getPlacePhotoUrl();
    }
    
  }

  sendForm(){
    console.log('formValue', this.tripForm.value)
  }

  getPlacePhotoUrl(){
    let place = this.tripForm.get('destination')!.value
    this.formService.getPlaceImage(place)
  .pipe(
    finalize(()=> this.sendForm()))
    .subscribe((res)=> {
      this.tripForm.controls['photo'].setValue(res.results[0].urls.raw)})
  };

  getInputError(field: string): string {
    return this.formService.getInputError(field, this.tripForm);
  }
}
