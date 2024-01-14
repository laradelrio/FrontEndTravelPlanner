import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '@app/shared/services/form.service';
import { Trip } from '@app/core/interfaces/trip.interface';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule
  ],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss'
})
export class DateInputComponent {

  @Input() dates!: FormGroup;
  @Input() type!: string;
  @Input() set trip(trip: Trip){
    if(trip != undefined){
      this.startDate = (trip.startDate).slice(0,19);
      this.endDate = trip.endDate.slice(0,19);
    }
  }

  private formService: FormService = inject(FormService);
  private nowDate =  new Date();
  public startDate = (this.nowDate).toISOString().slice(0,10);
  public endDate: string = '2028-12-31T00:00:00'
  public dateForm: {label: string, formControlName: string}[] = [
    {label: 'Start Date', formControlName: 'startDate'},
    {label: 'End Date', formControlName: 'endDate'},
  ] 

  getInputError(field: string): string {
    return this.formService.getInputError(field, this.dates);
  }

}
