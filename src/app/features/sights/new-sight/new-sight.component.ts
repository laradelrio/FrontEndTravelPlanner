import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '@app/shared/services/form.service';
import { DateInputComponent } from '@app/shared/components/date-input/date-input.component';
import { LocationSearchBoxComponent } from '@app/shared/components/location-search-box/location-search-box.component';
import { finalize } from 'rxjs';
import { NewSight } from '@app/core/interfaces/sight.interface';

@Component({
  selector: 'app-new-sight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateInputComponent, LocationSearchBoxComponent],
  templateUrl: './new-sight.component.html',
  styleUrl: './new-sight.component.scss'
})
export class NewSightComponent {

  public sightForm!: FormGroup; 
  private formService: FormService = inject(FormService);

  constructor(
    private fb: FormBuilder,
  ){
    this.sightForm = this.fb.group({
      sight: this.fb.group({ 
        name: ['', [Validators.required]],
        longitude: ['',[Validators.required]],
        latitude: ['',[Validators.required]]
      }) ,
      dates: this.fb.group({
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]]
      }),
      photo: ['']
    })
  }

  get datesFromGroup(): FormGroup{
    return this.sightForm.get('dates') as FormGroup
  }

  get sightFromGroup(): FormGroup{
    return this.sightForm.get('sight') as FormGroup
  }

  onSubmit(){
    this.sightForm.markAllAsTouched();
    if(this.sightForm.valid){
      this.getPlacePhotoUrl();
    }
  }

  getPlacePhotoUrl(){
    let place = `${this.sightForm.controls['sight'].value.name}`
    this.formService.getPlaceImage(place)
    .pipe(
      finalize(() => this.createNewSightObject())
    )
    .subscribe((res)=> {
      this.sightForm.controls['photo'].setValue(res.results[0].urls.raw)})
  };

  createNewSightObject(){
    console.log('here')
    let newSight: NewSight = {
      name: this.sightForm.controls['sight'].value.name,
      // fk_trips_id: this.sightForm.controls['fk_users_id'].value,
      longitude: this.sightForm.controls['sight'].value.longitude,
      latitude: this.sightForm.controls['sight'].value.latitude,
      startDate: this.sightForm.controls['dates'].value.startDate,
      endDate: this.sightForm.controls['dates'].value.endDate,
      photo: this.sightForm.controls['photo'].value,
    }

    console.log(newSight)
    this.sendSight(newSight);
  }

  sendSight(newSight: NewSight){
    console.log('sight', newSight)
  }

  getInputError(field: string): string {
    return this.formService.getInputError(field, this.sightForm);
  }
  
}
