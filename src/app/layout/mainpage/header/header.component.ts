import { Component, ViewChild, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { RegisterComponent } from '@app/features/auth/register/register.component';
import { LoginComponent } from '@app/features/auth/login/login.component';
import { UserApiService } from '@app/core/apiServices/user-api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ModalComponent, RegisterComponent, LoginComponent],

templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @ViewChild('registerModal') 
  private registerComponent!: RegisterComponent;
  
  @ViewChild('loginModal') 
  private loginComponent!: LoginComponent;

  private userApiService: UserApiService = inject(UserApiService);
  
  constructor(){
    effect(() => { this.isLoggedIn = this.userApiService.isLoggedIn()})
  }

  isLoggedIn = false;

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

  open2() {
    this.openModal2();
  }
  async openModal2() {
    return await this.loginComponent.openModal();
  }

  logout(){
   this.userApiService.logout()
    
  }

  

  
}
