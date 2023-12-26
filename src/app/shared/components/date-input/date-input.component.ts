import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule
  ],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss'
})
export class DateInputComponent implements OnInit{

  @Input() dates!: FormGroup;

  private nowDate =  new Date();
  public todayDate = (this.nowDate).toISOString().slice(0,10)
  public dateForm: {label: string, formControlName: string}[] = [
    {label: 'Start Date', formControlName: 'startDate'},
    {label: 'End Date', formControlName: 'endDate'},
  ] 

  constructor(){
    console.log(this.todayDate)
  }
  ngOnInit(): void {
    
  }
}
