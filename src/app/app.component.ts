import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserApiService } from './core/apiServices/user-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontTravelPlanner';

  private userApiService: UserApiService = inject(UserApiService);

  ngOnInit(): void {
    this.userApiService.setUserAuthorizationStatus();
  }

}
