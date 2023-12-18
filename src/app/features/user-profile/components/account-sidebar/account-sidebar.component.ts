import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-sidebar.component.html',
  styleUrl: './account-sidebar.component.scss'
})
export class AccountSidebarComponent {  
}
