import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '@app/shared/components/user-card/user-card.component';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, UserCardComponent],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss'
})
export class MatchesComponent {

}
