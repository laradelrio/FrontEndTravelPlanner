import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sight } from '@app/core/interfaces/sight.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-sights',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-sights.component.html',
  styleUrl: './view-sights.component.scss'
})
export class ViewSightsComponent {
  @Input() sights!: Sight[];
  private route: ActivatedRoute = inject(ActivatedRoute);
  private tripId = parseInt(this.route.snapshot.url[1].path);
  
  routerLink(): string{
    return `/sight/new/${this.tripId}`;
  }
}

