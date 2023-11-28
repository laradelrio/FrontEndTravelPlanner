import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-testfeature',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './testfeature.component.html',
  styleUrl: './testfeature.component.scss'
})
export class TestfeatureComponent {
  private route = inject(Router)
}
