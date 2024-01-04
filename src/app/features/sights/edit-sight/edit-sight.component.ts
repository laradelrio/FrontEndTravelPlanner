import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationSearchBoxComponent } from '@app/shared/components/location-search-box/location-search-box.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sight } from '@app/core/interfaces/sight.interface';
import { SightApiService } from '@app/core/apiServices/sight-api.service';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '@app/shared/services/form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-sight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LocationSearchBoxComponent],
  templateUrl: './edit-sight.component.html',
  styleUrl: './edit-sight.component.scss'
})
export class EditSightComponent implements OnInit {

  public indexSightBeingEdited!: number;
  private sightId!: number;
  public fieldBeingEdited!: string;
  public editSightForm!: FormGroup;
  public sights!: Sight[];
  private formService: FormService = inject(FormService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private tripId = parseInt(this.activatedRoute.snapshot.url[1].path);
  private sightService: SightApiService = inject(SightApiService);
  private subscription!: Subscription;  

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
    this.subscription = this.editSightForm.get('sight.longitude')!.valueChanges.subscribe((val) => {
      if (val != '') {
        this.sightLocationUpdated();
      }
    })
  }
  dismiss(h:string){
    console.log('DISMISS')
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
}
