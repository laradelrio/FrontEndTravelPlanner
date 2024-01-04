import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '@app/core/interfaces/user.interface';
import { SightApiService } from '@app/core/apiServices/sight-api.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  
  @Input()
  userProfiles!: UserData[] | null;
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
