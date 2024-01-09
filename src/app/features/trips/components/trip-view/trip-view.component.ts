import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '@app/core/interfaces/trip.interface';
import { TripApiService } from '@app/core/apiServices/trip-api.service';
import { ActivatedRoute, RouterLink} from '@angular/router';
import { MapComponent } from '@app/shared/components/map/map.component';
import { Sight } from '@app/core/interfaces/sight.interface';
import { SightApiService } from '@app/core/apiServices/sight-api.service';
import { CalendarComponent } from '@app/shared/components/calendar/calendar.component';

@Component({
  selector: 'app-trip-view',
  standalone: true,
  imports: [CommonModule, RouterLink, MapComponent, CalendarComponent],
  templateUrl: './trip-view.component.html',
  styleUrl: './trip-view.component.scss'
})
export class TripViewComponent implements OnInit{
  public trip!: Trip;
  private tripService: TripApiService = inject(TripApiService);
  private sightService: SightApiService = inject(SightApiService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private tripId = parseInt(this.route.snapshot.url[1].path);
  public isLoggedInUser!: boolean;
  public sights: Sight[] = [];

  constructor(){}

  ngOnInit(): void {
    this.getTrip();
    this.getSights();
  }

  getTrip(){
    this.tripService.getOneTrip(this.tripId)
    .subscribe( (res) =>{ this.trip = res.data;  
      this.isLoggedInUser = (res.data.fk_users_id).toString() === localStorage.getItem('userId');});
  }

  handleImageError(event: any): void{
    event.target.src =  "../../../../assets/trip-default.webp";
  }

  getFormattedDate(date:string): string{
    let inDate =  new Date(date);
    return inDate.toDateString();
  }

  getRouterLink(tripId: number): string{
    return `/trip/edit/${tripId}`
  }

  getSights() {
    this.sightService.getSights(this.tripId)
      .subscribe((res) => {
        this.sights = res.data;
      })
  }

  routerLink(): string{
    return `/sight/new/${this.trip.id}`;
  }

}
