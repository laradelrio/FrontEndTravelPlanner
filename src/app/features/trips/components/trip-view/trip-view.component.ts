import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '@app/core/interfaces/trip.interface';
import { TripApiService } from '@app/core/apiServices/trip-api.service';
import { ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

@Component({
  selector: 'app-trip-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-view.component.html',
  styleUrl: './trip-view.component.scss'
})
export class TripViewComponent implements OnInit{
  public trip!: Trip;
  private tripService: TripApiService = inject(TripApiService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private tripId = parseInt(this.route.snapshot.url[1].path);
  public isLoggedInUser!: boolean;

  constructor(){}

  ngOnInit(): void {
    this.getTrip();
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
    let inDate =  new Date();
    return inDate.toDateString();

  }

}
