import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '@app/shared/services/form.service';
import { DateInputComponent } from '@app/shared/components/date-input/date-input.component';
import { LocationSearchBoxComponent } from '@app/shared/components/location-search-box/location-search-box.component';
import { finalize } from 'rxjs';
import { NewSight } from '@app/core/interfaces/sight.interface';
import { ActivatedRoute } from '@angular/router';
import { ModalInfo } from '@app/core/interfaces/modal.interface';
import { ModalComponent } from '@app/shared/components/modal/modal.component';

@Component({
  selector: 'app-new-sight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DateInputComponent, LocationSearchBoxComponent, ModalComponent],
  templateUrl: './new-sight.component.html',
  styleUrl: './new-sight.component.scss'
})
export class NewSightComponent {

  public sightForm!: FormGroup; 
  private formService: FormService = inject(FormService);
  private route: ActivatedRoute = inject(ActivatedRoute);  
  @ViewChild('sharedModal') 
  private modalComponent!: ModalComponent;
  public modalInfo!: ModalInfo;

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
    return this.sightForm.get('dates') as FormGroup;
  }

  get sightFromGroup(): FormGroup{
    return this.sightForm.get('sight') as FormGroup;
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
    let newSight: NewSight = {
      name: this.sightForm.controls['sight'].value.name,
      fk_trips_id: parseInt(this.route.snapshot.url[1].path),
      longitude: this.sightForm.controls['sight'].value.longitude,
      latitude: this.sightForm.controls['sight'].value.latitude,
      startDate: this.sightForm.controls['dates'].value.startDate,
      endDate: this.sightForm.controls['dates'].value.endDate,
      photo: this.sightForm.controls['photo'].value,
    };
    this.sendSight(newSight);
  }

  sendSight(newSight: NewSight){
    console.log('sight', newSight)
  }

  getInputError(field: string): string {
    return this.formService.getInputError(field, this.sightForm);
  }

  writeModalContent(){
    this.modalInfo = {
      style: ".modal-style-primary",
      title: "",
      body: "Sight Added Successfully",
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
