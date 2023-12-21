import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '@app/core/interfaces/user.interface';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  userData: UserData = {
    id: 0,
    name: '',
    email: '',
    photo: 'http://tinyurl.com/mryxwjpc',
  };

  handleImageError(event: any): void{
    event.target.src =  "../../../../assets/user-default.webp";
  }
}
