import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-sidebar.component.html',
  styleUrl: './account-sidebar.component.scss'
})
export class AccountSidebarComponent {

  onDisplay: number = 1;

  setDisplay(profileSection: number){
    this.onDisplay = profileSection;
    console.log(profileSection)
  }
  
}
