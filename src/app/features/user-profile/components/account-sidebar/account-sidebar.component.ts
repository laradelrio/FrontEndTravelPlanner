import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { ModalInfo } from '@app/core/interfaces/modal.interface';

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalComponent],
  templateUrl: './account-sidebar.component.html',
  styleUrl: './account-sidebar.component.scss'
})
export class AccountSidebarComponent { 
  @ViewChild('sharedModal') 
  private modalComponent!: ModalComponent;
  public modalInfo!: ModalInfo;

  openDeleteModal(){
    this.modalInfo = {
      style: "modal-style-danger",
      title: "Delete Account",
      body: "Deleting your account is permanent. Are you sure you want to delete your account?",
      btnClass: "btn-danger",
      closeBtnName: "Cancel",
      actionBtnName: "Delete",
    }
    this.open();
  }

  open() {
    console.log("1")
    this.openModal();
  }

  async openModal() {
    console.log("2")
    return await this.modalComponent.open();
  }
  
  
}
