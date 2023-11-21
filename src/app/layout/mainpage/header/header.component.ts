import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { RegisterComponent } from '@app/features/auth/register/register.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ModalComponent, RegisterComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @ViewChild('registerModal') 
  private registerComponent!: RegisterComponent;
  
  async openModal() {
    return await this.registerComponent.openModal();
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
