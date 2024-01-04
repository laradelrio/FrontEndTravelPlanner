import { Component, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '@app/core/interfaces/trip.interface';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalComponent],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.scss'
})
export class TripCardComponent {

  @Input() set tripsValue(value: Trip[]) {
    this.trips = value;
    this.sortTrips();
  };
  @ViewChild('sharedModal')
  private modalComponent!: ModalComponent;
  trips!: Trip[];
  pastTrips: Trip[] = [];
  upcomingTrips: Trip[] = [];
  currentTrips: Trip[] = [];
  allTrips: Trip[][] = [this.currentTrips, this.upcomingTrips, this.pastTrips]
  sectionTitles: string[] = ['current-trip', 'upcoming-trips', 'past-trips']

  handleImageError(event: any): void {
    event.target.src = "../../../../assets/trip-default.webp";
  }

  dateFormat(start: string, finish: string): string {
    let tripDates: string = `${this.sliceDate(start)} to ${this.sliceDate(finish)}`
    return tripDates;
  }

  sliceDate(date: string): string {
    let day = date.toString().slice(8, 10);
    let month = date.toString().slice(5, 7);
    let year = date.toString().slice(2, 4);
    return `${day}-${month}-${year}`
  }

  sortTrips() {
    this.upcomingTrips = [];
    this.currentTrips = [];
    this.pastTrips = [];

    let today: Date = new Date();

    this.trips.forEach(trip => {
      let startDate: Date = new Date(trip.startDate);
      let endDate: Date = new Date(trip.endDate);

      if (startDate > today && endDate > today) {
        this.upcomingTrips.push(trip)
      } else if (startDate >= today == endDate <= today) {
        this.currentTrips.push(trip);
      } else {
        this.pastTrips.push(trip)
      }
    })
  }

  getRouterLink(tripId: number): string {
    return `/trip/${tripId}`
  }

  closeModal() {
    this.modalComponent.closeModals()
  }
}
