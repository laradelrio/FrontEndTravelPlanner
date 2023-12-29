import { ChangeDetectorRef, Component, OnChanges, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '@app/core/interfaces/trip.interface';
import { TripApiService } from '@app/core/apiServices/trip-api.service';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '@app/shared/services/form.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateInputComponent } from '@app/shared/components/date-input/date-input.component';
import { CountryDropdownComponent } from '@app/shared/components/country-dropdown/country-dropdown.component';

@Component({
  selector: 'app-trip-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateInputComponent, CountryDropdownComponent],
  templateUrl: './trip-edit.component.html',
  styleUrl: './trip-edit.component.scss'
})
export class TripEditComponent implements OnInit{

  public trip!: Trip;
  private tripService: TripApiService = inject(TripApiService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private tripId = parseInt(this.route.snapshot.url[2].path);
  public startLabel: string = 'start';
  public endLabel: string = 'end'
  private formService: FormService = inject(FormService);
  public editTripForm: FormGroup;
  public photo!: string;

  constructor(
    private fb: FormBuilder,
  ){
    this.editTripForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(14)]],
      fk_users_id: [localStorage.getItem('userId')],
      destination: this.fb.group({ 
        country: ['',[Validators.required]],
        city: ['',[Validators.required]]
      }) ,
      dates: this.fb.group({
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]]
      }),
    })
  }
  

  ngOnInit(): void {
    this.getTrip();
  }

  get destinationFromGroup(): FormGroup{
    return this.editTripForm.get('destination') as FormGroup
  }

  get datesFromGroup(): FormGroup{
    return this.editTripForm.get('dates') as FormGroup
  }

  detectFormValueChanges(): void {
    this.editTripForm.get('name')?.valueChanges.subscribe( (val) =>{ if(this.editTripForm.get('name')?.valid){this.updateTripData('name',val)}})
    this.editTripForm.get('destination.city')?.valueChanges.subscribe( (val) => {this.destinationChange(val);});
    this.editTripForm.get('dates.startDate')?.valueChanges.subscribe( (val) => this.updateTripData('startDate',val));
    this.editTripForm.get('dates.endDate')?.valueChanges.subscribe( (val) => {this.updateTripData('endDate',val)});
  }

  destinationChange(city: string){
    let newDest = `${city}, ${this.editTripForm.controls['destination'].value.country}`;
    if(newDest != this.trip.destination){
      this.getPlacePhotoUrl();
    }
    this.updateTripData('destination', newDest);
  }

  getTrip(){
    this.tripService.getOneTrip(this.tripId)
    .subscribe( (res) =>{ 
      this.trip = res.data;
      this.fillForm();
    })
  }

  fillForm(){
    this.editTripForm.get('name')?.setValue(this.trip.name);

    this.editTripForm.get('destination.city')?.setValue(
      (this.trip.destination).substring(0,(this.trip.destination).indexOf(',')));

    this.editTripForm.get('destination.country')?.setValue(
      (this.trip.destination).substring(((this.trip.destination).indexOf(',')+2)))
  
    this.editTripForm.get('dates.startDate')?.setValue(this.trip.startDate.slice(0,10));
    this.editTripForm.get('dates.endDate')?.setValue(this.trip.endDate.slice(0,10));
    this.photo = this.trip.photo

    this.detectFormValueChanges();
  }

  handleImageError(event: any): void{
    event.target.src =  "../../../../assets/trip-default.webp";
  }

  getPlacePhotoUrl(){
    let place = `${this.editTripForm.controls['destination'].value.city}, ${this.editTripForm.controls['destination'].value.country}`
    this.formService.getPlaceImage(place)
    .subscribe((res)=> {
      this.updateTripData('photo', res.results[0].urls.raw)
      this.photo = res.results[0].urls.raw
    })
  };

  getInputError(field: string): string {
    return this.formService.getInputError(field, this.editTripForm);
  }

    updateTripData(inputField: string, inputFieldValue: string){
    this.tripService.updateUser(this.trip.id, {field: inputField, value: inputFieldValue})
      .subscribe({
        next:  (res) => {},
      })
  }
}
