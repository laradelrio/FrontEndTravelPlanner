import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.scss'
})
export class UserProfileEditComponent {

  updatePhoto: boolean = false;

  setUpdatePhoto(){
    this.updatePhoto = true;
  }
}
