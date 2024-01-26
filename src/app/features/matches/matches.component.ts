import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '@app/shared/components/user-card/user-card.component';
import { TripApiService } from '@app/core/apiServices/trip-api.service';
import { Trip } from '@app/core/interfaces/trip.interface';
import { finalize } from 'rxjs';
import { UserData } from '@app/core/interfaces/user.interface';
import { UserApiService } from '@app/core/apiServices/user-api.service';
import { SightApiService } from '@app/core/apiServices/sight-api.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, UserCardComponent, RouterLink],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss'
})
export class MatchesComponent implements OnInit {

  private userApiService: UserApiService = inject(UserApiService);
  private tripsApiService: TripApiService = inject(TripApiService);
  private sightService: SightApiService = inject(SightApiService);
  private userId: number = parseInt(localStorage.getItem('userId')!);
  public userTripsStatus!: boolean;
  public trips: Trip[] = [];
  upcomingTrips: Trip[] = [];
  currentTrips: Trip[] = [];
  matchUserProfiles: (UserData[] | null)[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getUserTrips();
  }

  //Find logged it user's trips
  getUserTrips(): void {
    this.tripsApiService.getAllUserTrips(this.userId)
      .pipe(
        finalize(() => this.sortTrips())
      )
      .subscribe((res) => {
        this.userTripsStatus = res.success;
        this.trips = res.data;
      })
  }

  //sort logged in user's trips by current and upcoming
  sortTrips(): void {
    let today: Date = new Date();

    this.trips.forEach(trip => {
      let startDate: Date = new Date(trip.startDate);
      let endDate: Date = new Date(trip.endDate);

      if (startDate > today && endDate > today) {
        this.upcomingTrips.push(trip)
      } else if (startDate >= today == endDate <= today) {
        this.currentTrips.push(trip);
      }
    })
    this.getMatches();
  }

  //loop call for the matches of each of logged in user's trips
  async getMatches() {
    const currentPromises = this.currentTrips.map(async trip => await this.getTripMatches(trip));
    const upcomingPromises = this.upcomingTrips.map(async trip => await this.getTripMatches(trip));

    await Promise.all([...currentPromises, ...upcomingPromises]).then((tripMatches) => {
      this.getMatchesUsers(tripMatches);
    });
  }

  //get one trip's matches
  getTripMatches(trip: Trip): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tripsApiService.getAllTripMatches(trip)
        .subscribe((res) => {
          if (res.data !== undefined) {
            resolve(res.data);
          } else {
            resolve(null);
          }
        });
    })
  }

  //loop call for the users of each  match of logged in user's trips
  async getMatchesUsers(tripMatches: (Trip[] | null)[]) {
    tripMatches.forEach((matches, index) => {
      let tripId: number = this.getTripId(index);
      if (matches === null) {
        this.matchUserProfiles.push(null);
      } else {
        let userMatches: UserData[] = [];
        matches.forEach(async (match: Trip) => {
          let user = await this.getMatchUser(match);
          user.matchPercentage = await this.getMatchPercentage(match.id, tripId);
          userMatches.push(user);
        });
        this.matchUserProfiles.push(userMatches)
      }
    })
  }

  getTripId(i: number): number {
    if (this.currentTrips.length > i) {
      return this.currentTrips[i].id
    } else {
      return this.upcomingTrips[i - this.currentTrips.length].id
    }
  }

  //get one match's user profile
  getMatchUser(match: Trip): Promise<UserData> {
    return new Promise<UserData>((resolve, reject) => {
      this.userApiService.getUser(match.fk_users_id)
        .subscribe((res) => {
          if (res.data != undefined) {
            resolve(res.data)
          }
        })
    })
  }

  getMatchPercentage(matchTripId: number, loggedUserTrip: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.sightService.getMatchPercentage({ trip1: matchTripId, trip2: loggedUserTrip })
        .subscribe((res) => {
          if (res.data.matchPercentage === null) {
            resolve(10)
          } else {
            resolve(parseInt(res.data.matchPercentage))
          }
        })
    })
  }

}
