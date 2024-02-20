import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationSearchBoxComponent } from '@app/shared/components/location-search-box/location-search-box.component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sight } from '@app/core/interfaces/sight.interface';
import { SightApiService } from '@app/core/apiServices/sight-api.service';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '@app/shared/services/form.service';
import { Subscription, finalize } from 'rxjs';
import { TripApiService } from '@app/core/apiServices/trip-api.service';
import { Trip } from '@app/core/interfaces/trip.interface';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { ModalInfo } from '@app/core/interfaces/modal.interface';

@Component({
  selector: 'app-edit-sight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LocationSearchBoxComponent, ModalComponent],
  templateUrl: './edit-sight.component.html',
  styleUrl: './edit-sight.component.scss'
})
export class EditSightComponent implements OnInit {
  
  public indexSightBeingEdited!: number;
  private sightId!: number;
  public fieldBeingEdited!: string;
  public editSightForm!: FormGroup;
  public sights: Sight[] = [];
  private formService: FormService = inject(FormService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private tripId = parseInt(this.activatedRoute.snapshot.url[1].path);
  private sightService: SightApiService = inject(SightApiService);
  private tripService: TripApiService = inject(TripApiService);
  private subscription!: Subscription;  
  public startDate: string = '2024-01-30T00:00:00';
  public endDate: string = '2028-12-31T00:00:00';
  public title: string = 'Edit Sights'
  @ViewChild('sharedModal') 
  private modalComponent!: ModalComponent;
  public modalInfo!: ModalInfo;
  @Input() set setSight(value: Sight){
    this.sights = [value];
    this.title = `${value.name}`;
  }

  constructor(
    private fb: FormBuilder,
  ) {
    this.editSightForm = this.fb.group({
      sight: this.fb.group({
        name: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
        latitude: ['', [Validators.required]]
      }),
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getSights();
    this.getTrip();
  }
  
  get sightFromGroup(): FormGroup {
    return this.editSightForm.get('sight') as FormGroup;
  }

  getSights() {
    this.sightService.getSights(this.tripId)
      .subscribe((res) => {
        this.sights = res.data;
      })
  }

  getTrip() {
    let tripId: number = parseInt(this.activatedRoute.snapshot.url[1].path);
    this.tripService.getOneTrip(tripId)
      .pipe(
        finalize(() => {
          this.editSightForm.get('startDate')!.setValidators([this.dateValidator.bind(this), Validators.required]);
      })
      )
      .subscribe((res) => {
        this.startDate = (res.data.startDate).slice(0,19);
      this.endDate = res.data.endDate.slice(0,19);
      })
  }

  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    let returnValue: { [key: string]: any } | null = { invalidDate: false }
    if (control.value != ''){
      let inputDate = new Date(control.value);
      let startDate = new Date(this.startDate);
      let endDate = new Date(this.endDate);
      if (inputDate >= startDate && inputDate <= endDate) {
        returnValue = null;
      }
    }
    return returnValue;
  }

  isValidDate(field:string): boolean | null {
    return !(this.editSightForm.get(field)?.valid);
  }
  
  getInputError(field: string): string {
    return this.formService.getInputError(field, this.editSightForm);
  }

  getFormattedDate(date: string): string {
    return `${date.slice(0,10)} ${date.slice(11,16)}`;
  }

  enableEditField(field: string, i: number, sightId: number) {
    this.sightId = sightId;
    if (field === 'sight.name') {
      this.editSightForm.get(field)!.setValue(this.sights[i].name);
      this.subscribeToCoordinateChange()
    } else if (field=== 'startDate') {
      this.editSightForm.get(field)!.setValue(Object.values(this.sights[i])[5].slice(0, 16));
    } else if (field=== 'endDate') {
      this.editSightForm.get(field)!.setValue(Object.values(this.sights[i])[6].slice(0, 16));
    }

    this.indexSightBeingEdited = i;
    this.fieldBeingEdited = field;
  }

  disableEditField() {
    this.indexSightBeingEdited = this.sights.length + 1;
    this.fieldBeingEdited = '';
  }

  subscribeToCoordinateChange() {
    this.subscription = this.editSightForm.get('sight.longitude')!.valueChanges.subscribe(async (val) => {
      if (val != '') {
        await this.sightLocationUpdated();
      }
    })
  }
  
  async sightLocationUpdated() {
    this.updateSightData('name', this.editSightForm.get('sight.name')!.value);
    this.updateSightData('longitude', this.editSightForm.get('sight.longitude')!.value);
    this.updateSightData('latitude', this.editSightForm.get('sight.latitude')!.value);
    let photoUrl = await this.formService.getPlacePhotoUrl(this.editSightForm.get('sight.name')!.value);
    this.updateSightData('photo', photoUrl);
    this.subscription.unsubscribe();
  }

  updateSightData(inputField: string, inputFieldValue: string) {
    this.disableEditField();
    this.sightService.updateSight(this.sightId, {field: inputField, value: inputFieldValue})
      .subscribe({
        next:  (res) => { this.getSights()},
      })
  }

  openDeleteModal(sightId: number){
    this.modalInfo = this.formService.getDeleteModalInfo('this sight');
    this.sightId = sightId;
    this.open();
  }

  open() {
    this.openModal();
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  deleteSight(value: string){
    if(value === 'Action click'){
      this.sightService.deleteSight(this.sightId)
      .pipe(
        finalize( () => {
          this.getSights();
        })
      )
      .subscribe();
    }
  }
}
