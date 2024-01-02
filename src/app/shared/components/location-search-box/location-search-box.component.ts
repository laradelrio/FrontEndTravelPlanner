import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { GeoService } from '@app/shared/services/geo.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SightSearchSuggestions } from '@app/core/interfaces/geo.interface';

@Component({
  selector: 'app-location-search-box',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './location-search-box.component.html',
  styleUrl: './location-search-box.component.scss'
})
export class LocationSearchBoxComponent {

  @Input() sight!: FormGroup;
  public display: boolean = false;
  public addressOptions: SightSearchSuggestions[] = [];
  private geoService: GeoService = inject(GeoService);

  async getAddressOptions() {
    this.display = true;
    this.addressOptions = [];
    let url: string = await this.getUrl();

    this.geoService.getAddressOptions(url)
      .pipe(
        finalize(() => {
          this.display = true;
        }))
      .subscribe((res) => {
        console.log('ressss', res.slice(0,5))
        this.addressOptions = res;
        
      })
  }

  //return the url to search fro the address options
  async getUrl(): Promise<string> {
    let input: string = this.sight.get('name')!.value;
    console.log('input', input)
    let searchableValue = this.optimizeText(input!.toString());
    let url: string = `https://nominatim.openstreetmap.org/search.php?q=${searchableValue}&format=jsonv2`;
    return url;
  }

  //replace space, / and uppercase from typed address
  optimizeText(inputText: string): string {
    const textWithSpacesReplaced = inputText.replace(/ /g, "+");
    const finalText = textWithSpacesReplaced.toLowerCase();
    return finalText;
  }

  //when an address option is clicked
  selectAddress(address: SightSearchSuggestions) {
    this.sight.get('name')?.setValue(address.name)
    this.sight.get('longitude')?.setValue(address.lon);
    this.sight.get('latitude')?.setValue(address.lat);
    this.display = false;
  }

  isValidAddress(): boolean | null {
    return !(this.sight.get('name')?.valid && this.sight.get('latitude')?.valid && this.sight.get('longitude')?.valid) && this.sight.controls['name'].touched;
  }

  deleteCoordinates() {
    this.sight.get('longitude')?.setValue('');
    this.sight.get('latitude')?.setValue('');
  }
}
