import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { ModalInfo } from '@app/core/interfaces/modal.interface';

@Component({
  selector: 'app-account-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalComponent],
  templateUrl: './account-sidebar.component.html',
  styleUrl: './account-sidebar.component.scss'
})
export class AccountSidebarComponent implements OnInit {

  @ViewChild('sharedModal') 
  private modalComponent!: ModalComponent;
  public modalInfo!: ModalInfo;
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.activeSection(this.router.url);
  }

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
    this.openModal();
  }

  async openModal() {
    return await this.modalComponent.open();
  }
  
  activeSection(navLink: string): string {
    if(this.router.url === navLink){
      return 'active'
    }
    return ""
  } 
  
}
