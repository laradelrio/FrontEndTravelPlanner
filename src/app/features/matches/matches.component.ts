import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '@app/shared/components/user-card/user-card.component';
import { TripApiService } from '@app/core/apiServices/trip-api.service';
import { Trip } from '@app/core/interfaces/trip.interface';
import { finalize } from 'rxjs';
import { UserData } from '@app/core/interfaces/user.interface';
import { UserApiService } from '@app/core/apiServices/user-api.service';


@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, UserCardComponent],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss'
})
export class MatchesComponent implements OnInit{

  private userApiService: UserApiService = inject(UserApiService);
  private tripsApiService: TripApiService = inject(TripApiService);
  private userId: number = parseInt(localStorage.getItem('userId')!);
  public userTripsStatus!: boolean;
  public trips: Trip[] = [];
  upcomingTrips: Trip[] = [];
  currentTrips: Trip[] = [];
  tripMatches: (Trip[]|null)[]  = [];
  matchUserProfiles: (UserData[] | null)[] = [];

  constructor(){}

  ngOnInit(): void {
    this.getUserTrips(); 
  }

  //Find logged it user's trips
  getUserTrips(): void{
    this.tripsApiService.getAllUserTrips(this.userId)
    .pipe(
      finalize( () => this.sortTrips())
    )
    .subscribe( (res) => {
      this.userTripsStatus = res.success;
      this.trips = res.data;
    })
  }

  //sort logged in user's trips by current and upcoming
  sortTrips(): void{
    let today: Date= new Date();
    
    this.trips.forEach( trip => {
      let startDate: Date = new Date(trip.startDate);
      let endDate: Date = new Date(trip.endDate);

      if(startDate > today && endDate > today){
        this.upcomingTrips.push(trip)
      } else if (startDate >= today == endDate <= today){
        this.currentTrips.push(trip);
      } 
    })
    this.getMatches();
  }

  //loop call for the matches of each of logged in user's trips
  getMatches(){
    this.currentTrips.forEach( (trip) => {
      this.getTripMatches(trip);
    });

    this.upcomingTrips.forEach( (trip) => {
      this.getTripMatches(trip);
    });

  }

  //get one trip's matches
  getTripMatches(trip: Trip): void{
    this.tripsApiService.getAllTripMatches(trip)
    .pipe(
      finalize(()=> {
        if(this.tripMatches.length === (this.currentTrips.length + this.upcomingTrips.length)){
          this.getMatchesUsers();
        }
      })
    )
    .subscribe( (res) => {
      if(res.data !== undefined){
        this.tripMatches.push(res.data);
      } else {
        this.tripMatches.push(null);
      }
    });
  }

  //loop call for the users of each  match of logged in user's trips
  getMatchesUsers(){
    this.tripMatches.forEach( (matches) => {
      if(matches === null){
        this.matchUserProfiles.push(null);
      } else {
        let userMatches: UserData[] = [];
        matches.forEach( async (match: Trip) => {
          let user = await this.getMatchUser(match)
          userMatches.push(user);
        });
        this.matchUserProfiles.push(userMatches)
      }      
    })
  }

  //get one match's user profile
  getMatchUser(match: Trip): Promise<UserData>{
    return new Promise<UserData>((resolve, reject)=> {
      this.userApiService.getUser(match.fk_users_id)
      .subscribe( (res) => {
        if(res.data != undefined){
          resolve(res.data)
        }
      })
    })
  }

}
