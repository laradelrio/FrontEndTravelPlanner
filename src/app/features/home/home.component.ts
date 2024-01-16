import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RegisterComponent } from '../auth/register/register.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { LoginComponent } from '../auth/login/login.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalComponent, RegisterComponent, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  @ViewChild('registerModal') 
  private registerComponent!: RegisterComponent;
  private modalRef!: NgbModalRef;

  @ViewChild('loginModal') 
  private loginComponent!: LoginComponent;

  openRegister() {
    this.openModalRegister();
  }

  async openModalRegister() {
    return await this.registerComponent.openModal();
  }

  openLogin() {
    this.openModalLogin();
  }
  
  async openModalLogin() {
    return await this.loginComponent.openModal();
  }

}
