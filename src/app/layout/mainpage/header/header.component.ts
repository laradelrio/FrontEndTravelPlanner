import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@app/shared/components/modal/modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @ViewChild('sharedModal') 
  private modalComponent!: ModalComponent;
  modalStyle: string = 'modal-style-primary';
  modalTitle: string = 'Info Confirmation';
  modalBody: string = 'This is a Information Confirmation message';
  modalButtonColor: string = 'btn-primary';


  
  async openModal() {
    return await this.modalComponent.open();
  }

  getModalValue(value: any) {
    if (value == 'Save click') {
      console.log(value);
    }
  }

  open() {
    this.openModal();
  }
}
