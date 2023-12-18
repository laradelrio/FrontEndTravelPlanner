import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountSidebarComponent } from './components/account-sidebar/account-sidebar.component';
import { UserProfileViewComponent } from './components/user-profile-view/user-profile-view.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, AccountSidebarComponent,UserProfileViewComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {


}
