import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '@app/core/interfaces/trip.interface';
import { TripApiService } from '@app/core/apiServices/trip-api.service';
import { ActivatedRoute, Router, RouterLink} from '@angular/router';
import { MapComponent } from '@app/shared/components/map/map.component';
import { Sight } from '@app/core/interfaces/sight.interface';
import { SightApiService } from '@app/core/apiServices/sight-api.service';
import { CalendarComponent } from '@app/shared/components/calendar/calendar.component';
import { ViewSightsComponent } from '@app/features/sights/view-sights/view-sights.component';
import { finalize } from 'rxjs';
import { FormService } from '@app/shared/services/form.service';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { ModalInfo } from '@app/core/interfaces/modal.interface';

@Component({
  selector: 'app-trip-view',
  standalone: true,
  imports: [CommonModule, RouterLink, MapComponent, CalendarComponent, ViewSightsComponent, ModalComponent],
  templateUrl: './trip-view.component.html',
  styleUrl: './trip-view.component.scss'
})
export class TripViewComponent implements OnInit{

  @ViewChild('sharedModal') 
  private modalComponent!: ModalComponent;
  public modalInfo!: ModalInfo;
  public trip!: Trip;
  private tripService: TripApiService = inject(TripApiService);
  private sightService: SightApiService = inject(SightApiService);
  private formService: FormService = inject(FormService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private tripId = parseInt(this.route.snapshot.url[1].path);
  public isLoggedInUser!: boolean;
  public sights: Sight[] = [];

  constructor(){}

  ngOnInit(): void {
    this.getTrip();
    this.getSights();
  }

  getTrip(){
    this.tripService.getOneTrip(this.tripId)
    .subscribe( (res) =>{ this.trip = res.data;  
      this.isLoggedInUser = (res.data.fk_users_id).toString() === localStorage.getItem('userId');});
  }

  handleImageError(event: any): void{
    event.target.src =  "../../../../assets/trip-default.webp";
  }

  getFormattedDate(date:string): string{
    let inDate =  new Date(date);
    return inDate.toDateString();
  }

  getRouterLink(tripId: number): string{
    return `/trip/edit/${tripId}`
  }

  getSights() {
    this.sightService.getSights(this.tripId)
      .subscribe((res) => {
        this.sights = res.data;
      })
  }

  routerLink(): string{
    return `/sight/new/${this.trip.id}`;
  }

  openDeleteModal(){
    this.modalInfo = this.formService.getDeleteModalInfo('this trip');
    this.open();
  }

  open() {
    this.openModal();
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  deleteTrip(value: string){
    if(value === 'Action click'){
      this.tripService.deleteTrip(this.trip.id)
      .pipe(
        finalize( () => {
          this.router.navigate(['/trips'])
        })
      )
      .subscribe();
    }
  }

}
