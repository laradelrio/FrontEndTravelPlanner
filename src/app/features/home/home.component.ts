import { Component, ViewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RegisterComponent } from '../auth/register/register.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { LoginComponent } from '../auth/login/login.component';
import { UserApiService } from '@app/core/apiServices/user-api.service';
import { UserCardComponent } from '@app/shared/components/user-card/user-card.component';
import { UserData } from '@app/core/interfaces/user.interface';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalComponent, RegisterComponent, LoginComponent, UserCardComponent, CarouselModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  @ViewChild('registerModal')
  private registerComponent!: RegisterComponent;
  private modalRef!: NgbModalRef;

  @ViewChild('loginModal')
  private loginComponent!: LoginComponent;


  private userService: UserApiService = inject(UserApiService);
  public userProfiles: UserData[] = [
    {
      id: 1,
      name: 'Jenifer',
      email: 'jenifer@mail.com',
      photo: 'http://tinyurl.com/4af7t7cb',
      matchPercentage: 33,
    },
    {
      id: 1,
      name: 'Josue',
      email: 'josue@mail.com',
      photo: 'https://i.pinimg.com/736x/a8/06/0a/a8060af01fe6971b37f945fb34275acb.jpg',
      matchPercentage: 66,
    },
    {
      id: 1,
      name: 'Marco',
      email: 'manolo@mail.com',
      photo: 'http://tinyurl.com/3ur52s76',
      matchPercentage: 33,
    },
    {
      id: 1,
      name: 'Fatima',
      email: 'fatima@mail.com',
      photo: 'http://tinyurl.com/4885aue5',
      matchPercentage: 66,
    },
    {
      id: 1,
      name: 'Lucy',
      email: 'lucy@mail.com',
      photo: 'http://tinyurl.com/26nntf4t',
      matchPercentage: 66,
    }
  ];

  responsiveOptions: any[] = [
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor() {
    effect(() => {
      if (this.userService.openLogin()) {
        this.openLogin();
      }
    })
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

}
