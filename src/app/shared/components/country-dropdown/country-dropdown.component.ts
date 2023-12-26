import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormService } from '@app/shared/services/form.service';
import { finalize } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-country-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './country-dropdown.component.html',
  styleUrl: './country-dropdown.component.scss'
})
export class CountryDropdownComponent {

  @Input() destination!: FormGroup;
  @ViewChild('country') country!: ElementRef ;  
  @ViewChild('city') city!: ElementRef ;
  private formService: FormService = inject(FormService);
  public citiesInAlphOrder: string[] = [];

  getCities() {
    let countryLowerCase =  (this.country.nativeElement.value).toLowerCase();
    let cities: string[] = [];
    console.log(countryLowerCase)
    this.formService.getCitiesInCountry(countryLowerCase)
    .pipe(
      finalize(() => this.orderCitiesAlphabetically(cities))
    )
    .subscribe({
      next: (res) => {cities = res.data},
      error: (err) => {this.destination.controls['city'].setValue('.')}
    });
  }

  orderCitiesAlphabetically(cities: string[]){
    this.citiesInAlphOrder = cities.sort(function (a, b) {
      if (a < b) {
        return -1;
      }
      if (a> b) {
        return 1;
      }
      return 0;
    });
  }

  onCitySelected(){
    this.destination.controls['destination'].setValue(`${this.city.nativeElement.value}, ${this.country.nativeElement.value}`)
  }

}
