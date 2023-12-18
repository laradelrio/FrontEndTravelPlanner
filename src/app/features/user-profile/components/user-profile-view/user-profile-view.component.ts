import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSidebarComponent } from '../account-sidebar/account-sidebar.component';

@Component({
  selector: 'app-user-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-view.component.html',
  styleUrl: './user-profile-view.component.scss'
})
export class UserProfileViewComponent {

}
