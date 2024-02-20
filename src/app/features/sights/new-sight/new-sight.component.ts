import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { FormService } from '@app/shared/services/form.service';
import { DateInputComponent } from '@app/shared/components/date-input/date-input.component';
import { LocationSearchBoxComponent } from '@app/shared/components/location-search-box/location-search-box.component';
import { finalize } from 'rxjs';
import { NewSight } from '@app/core/interfaces/sight.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalInfo } from '@app/core/interfaces/modal.interface';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { SightApiService } from '@app/core/apiServices/sight-api.service';
import { Trip } from '@app/core/interfaces/trip.interface';
import { TripApiService } from '@app/core/apiServices/trip-api.service';

@Component({
  selector: 'app-new-sight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateInputComponent, LocationSearchBoxComponent, ModalComponent],
  templateUrl: './new-sight.component.html',
  styleUrl: './new-sight.component.scss'
})
export class NewSightComponent implements OnInit {

  @ViewChild('sharedModal')
  private modalComponent!: ModalComponent;
  public modalInfo!: ModalInfo;
  public sightForm!: FormGroup;
  private formService: FormService = inject(FormService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private route: Router = inject(Router);
  private sightService: SightApiService = inject(SightApiService);
  private tripService: TripApiService = inject(TripApiService);
  public trip!: Trip;

  constructor(
    private fb: FormBuilder,
  ) {
    this.sightForm = this.fb.group({
      sight: this.fb.group({
        name: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
        latitude: ['', [Validators.required]]
      }),
      dates: this.fb.group({
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]]
      }),
      photo: ['']
    })
  }

  ngOnInit(): void {
    this.getTrip();
  }

  get startDate(): AbstractControl {
    return this.sightForm.get('dates.startDate')!;
  }

  get endDate(): AbstractControl {
    return this.sightForm.get('dates.endDate')!;
  }

  get datesFromGroup(): FormGroup {
    return this.sightForm.get('dates') as FormGroup;
  }

  get sightFromGroup(): FormGroup {
    return this.sightForm.get('sight') as FormGroup;
  }
  
  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    let returnValue: { [key: string]: any } | null = { invalidDate: false }
    if (control.value != ''){
      let inputDate = new Date(control.value);
      let startDate = new Date(this.trip.startDate);
      let endDate = new Date(this.trip.endDate);

      if (inputDate >= startDate && inputDate <= endDate) {
        returnValue = null;
      }
    }
    return returnValue;
  }

  getTrip() {
    let tripId: number = parseInt(this.activatedRoute.snapshot.url[1].path);
    this.tripService.getOneTrip(tripId)
      .pipe(
        finalize(() => {
          this.startDate.setValidators([this.dateValidator.bind(this), Validators.required]);
          this.endDate.setValidators([this.dateValidator.bind(this), Validators.required]);
      })
      )
      .subscribe((res) => {
        this.trip = res.data;
      })
  }

  onSubmit() {
    this.sightForm.markAllAsTouched();
    if (this.sightForm.valid) {
      this.getPlacePhotoUrl();
    }
  }

  getPlacePhotoUrl() {
    let place = `${this.sightForm.controls['sight'].value.name}`
    this.formService.getPlaceImage(place)
      .pipe(
        finalize(() => this.createNewSightObject())
      )
      .subscribe((res) => {
        this.sightForm.controls['photo'].setValue(res.results[0].urls.raw)
      })
  };

  createNewSightObject() {
    let newSight: NewSight = {
      name: this.sightForm.controls['sight'].value.name,
      fk_trips_id: parseInt(this.activatedRoute.snapshot.url[1].path),
      longitude: this.sightForm.controls['sight'].value.longitude,
      latitude: this.sightForm.controls['sight'].value.latitude,
      startDate: this.sightForm.controls['dates'].value.startDate,
      endDate: this.sightForm.controls['dates'].value.endDate,
      photo: this.sightForm.controls['photo'].value,
    };
    this.sendSight(newSight);
  }

  sendSight(newSight: NewSight) {
    this.sightService.addNewSight(newSight)
      .subscribe((res) => {
        if (res.success) {
          this.writeModalContent();
          this.route.navigate([`/trip/${parseInt(this.activatedRoute.snapshot.url[1].path)}`])
        }
      })
  }

  getInputError(field: string): string {
    return this.formService.getInputError(field, this.sightForm);
  }

  writeModalContent() {
    this.modalInfo = {
      style: ".modal-style-primary",
      title: "",
      body: "Sight Added Successfully",
      btnClass: "btn-bl+ue",
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
