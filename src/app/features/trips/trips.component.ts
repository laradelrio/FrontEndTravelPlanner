import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripCardComponent } from '@app/shared/components/trip-card/trip-card.component';
import { Trip } from '@app/core/interfaces/trip.interface';
import { TripApiService } from '@app/core/apiServices/trip-api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, TripCardComponent, RouterLink],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss'
})
export class TripsComponent implements OnInit{

  private tripsApiService: TripApiService = inject(TripApiService);
  public trips: Trip[] = [];
  public userTripsStatus!: boolean;
  private userId: number = parseInt(localStorage.getItem('userId')!);

  ngOnInit(): void {
    this.getUserTrips()
  }

  getUserTrips(){
    this.tripsApiService.getAllUserTrips(this.userId).subscribe( (res) => {
      this.userTripsStatus = res.success;
      this.trips = res.data;
    })
  }
}
