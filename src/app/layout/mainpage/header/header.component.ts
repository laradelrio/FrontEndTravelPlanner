import { Component, ViewChild, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { RegisterComponent } from '@app/features/auth/register/register.component';
import { LoginComponent } from '@app/features/auth/login/login.component';
import { UserApiService } from '@app/core/apiServices/user-api.service';
import { Router, RouterLink } from '@angular/router';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ModalComponent, RegisterComponent, LoginComponent, RouterLink, AppComponent],

templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @ViewChild('registerModal') 
  private registerComponent!: RegisterComponent;
  isLoggedIn!: boolean;
  
  @ViewChild('loginModal') 
  private loginComponent!: LoginComponent;

  private userApiService: UserApiService = inject(UserApiService);
  private router = inject(Router)
  private appComponent:AppComponent = inject(AppComponent);

  constructor(){
    effect(() => this.isLoggedIn = this.userApiService.isLoggedIn())
  }

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

  logout(){
    this.userApiService.logout()
    this.appComponent.stopUserActivityCheck()
  }

}
