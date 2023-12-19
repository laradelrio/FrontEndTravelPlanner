import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserApiService } from '@app/core/apiServices/user-api.service';
import { UserData } from '@app/core/interfaces/user.interface';
import { TripApiService } from '@app/core/apiServices/trip-api.service';
import { ApiResp } from '@app/core/interfaces/apiResponses.interface';
import { TripCardComponent } from '@app/shared/components/trip-card/trip-card.component';

@Component({
  selector: 'app-user-profile-view',
  standalone: true,
  imports: [CommonModule, TripCardComponent], 
  templateUrl: './user-profile-view.component.html',
  styleUrl: './user-profile-view.component.scss'
})
export class UserProfileViewComponent implements OnInit{
  private userApiService: UserApiService = inject(UserApiService);
  private tripsApiService: TripApiService = inject(TripApiService);
  public matchPercentage: number = 0;
  public userData!: UserData;
  public userTripsStatus!: ApiResp;

  ngOnInit(): void {
    this.getUserData()
  }

  getUserData(){
    this.userApiService.getUser(4).subscribe( (res) => {
      this.userData = res.data
    });
  }

}
