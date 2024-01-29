import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sight } from '@app/core/interfaces/sight.interface';
import { Map, Popup } from 'mapbox-gl';
import { GeoService } from '@app/shared/services/geo.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

  @ViewChild('mapDiv') mapDivElement!: ElementRef;
  @Input() set setSights(value: Sight[]) {
    this.sights = value;
    if (this.sights.length != 0) {
      this.makeMap();
    }
  };
  @Input() set tripLocation(location: string) {
    this.getMapCenter(location)
    if (location != null) {
      this.makeMap();
    }
  };
  private sights!: Sight[];
  private geoService: GeoService = inject(GeoService);
  private mapCenter!: [number, number];

  async makeMap() {
      let map = new Map({
      container: this.mapDivElement.nativeElement, // container where the map will be rendered
      style: 'mapbox://styles/mapbox/navigation-day-v1', // style URL
      center: this.mapCenter, // starting position [lng, lat]
      zoom: 12, // starting zoom
    });

    this.addPopup(map)
  }

  addPopup(map: Map) {
    this.sights.forEach((sight) => {
      let popup = new Popup({ closeOnClick: false })
        .setLngLat([sight.longitude, sight.latitude])
        .setHTML(` <p class='mapPopupText'>${sight.name} </p> `)
        .addTo(map)

    })
  }

  getMapCenter(tripLocation: string){
    let url: string = `https://nominatim.openstreetmap.org/search.php?q=${tripLocation}&format=jsonv2`;
    this.geoService.getAddressOptions(url)
    .pipe(
      finalize(() => {
        this.makeMap();
      }))
    .subscribe((res) => {
      this.mapCenter=  [res[0].lon, res[0].lat]
    })
  }

}
