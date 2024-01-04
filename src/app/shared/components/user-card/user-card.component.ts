import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '@app/core/interfaces/user.interface';
import { SightApiService } from '@app/core/apiServices/sight-api.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalInfo } from '@app/core/interfaces/modal.interface';
import { UserProfileViewComponent } from '@app/features/user-profile/components/user-profile-view/user-profile-view.component';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, ModalComponent, UserProfileViewComponent],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  
  @ViewChild('sharedModal') 
  private modalComponent!: ModalComponent;
  public modalInfo!: ModalInfo;
  public userDisplayed!: UserData;
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

  openUserModal(user: UserData){
    this.userDisplayed = user;
    this.modalInfo = {
      style: "modal-style-primary",
      title: "",
      body: "",
      btnClass: "btn-blue",
      closeBtnName: "",
      actionBtnName: "Okay",
    }
    this.open();
  }

  open() {
    this.openModal();
  }

  async openModal() {
    return await this.modalComponent.openXL();
  }
}
