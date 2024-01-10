import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryDropdownComponent } from '@app/shared/components/country-dropdown/country-dropdown.component';
import { DateInputComponent } from '@app/shared/components/date-input/date-input.component';
import { FormService } from '@app/shared/services/form.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { NewTrip, Trip } from '@app/core/interfaces/trip.interface';
import { TripApiService } from '@app/core/apiServices/trip-api.service';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { ModalInfo } from '@app/core/interfaces/modal.interface';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CountryDropdownComponent, DateInputComponent, ModalComponent],
  templateUrl: './trip-form.component.html',
  styleUrl: './trip-form.component.scss'
})
export class TripFormComponent {

  public startLabel: string = 'start';
  public endLabel: string = 'end'
  private formService: FormService = inject(FormService);
  private tripService: TripApiService = inject(TripApiService);
  public tripForm: FormGroup;
  @ViewChild('sharedModal') 
  private modalComponent!: ModalComponent;
  public modalInfo!: ModalInfo;

  constructor(
    private fb: FormBuilder,
  ){
    this.tripForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
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

  createNewTripObject(){
    let newTrip: NewTrip = {
      name: this.tripForm.controls['name'].value,
      user: this.tripForm.controls['fk_users_id'].value,
      destination: `${this.tripForm.controls['destination'].value.city}, ${this.tripForm.controls['destination'].value.country}`,
      startDate: this.tripForm.controls['dates'].value.startDate,
      endDate: this.tripForm.controls['dates'].value.endDate,
      photo: this.tripForm.controls['photo'].value,
    }
    this.sendTrip(newTrip)
  }

  sendTrip(newTrip: NewTrip){
    this.tripService.addNewTrip(newTrip).
    subscribe( (res) => {
      if(res.success){
        this.writeModalContent();
      }
    })
  }

  getPlacePhotoUrl(){
    let place = `${this.tripForm.controls['destination'].value.city}, ${this.tripForm.controls['destination'].value.country}`
    this.formService.getPlaceImage(place)
    .pipe(
      finalize(() => this.createNewTripObject())
    )
    .subscribe((res)=> {
      this.tripForm.controls['photo'].setValue(res.results[0].urls.raw)})
  };

  getInputError(field: string): string {
    return this.formService.getInputError(field, this.tripForm);
  }

  writeModalContent(){
    this.modalInfo = {
      style: ".modal-style-primary",
      title: "",
      body: "Trip Created Successfully",
      btnClass: "btn-blue",
      closeBtnName: "",
      actionBtnName: "Okay",
    }
    this.open();
  }

  open() {
    this.openModal();
  }

  async openModal() {
    return await this.modalComponent.open();
  }
}
