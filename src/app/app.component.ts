import { Component, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserApiService } from './core/apiServices/user-api.service';
import { ModalComponent } from './shared/components/modal/modal.component';
import { ModalInfo } from './core/interfaces/modal.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  @ViewChild('sharedModal') modalComponent!: ModalComponent;
  title = 'frontTravelPlanner';
  private userApiService: UserApiService = inject(UserApiService);
  private lastMouseMove: number = Date.now();
  private checkActivityInterval!: number; 
  private modalClicked: boolean = false;
  
  modalInfo: ModalInfo = {
    style: '',
    title: '',
    body: 'Are you still there?',
    btnClass: '.btn btn-blue',
    closeBtnName: '',
    actionBtnName: 'Yes'
  }
  
  ngOnInit(): void {
    this.checkUserLoggedIn();
  }

  //trigger Inactivity Modal
  open() {
    this.openModal();
    this.checkIfModalIgnored();
  }

  //Open Inactivity Modal
  async openModal() {
    return await this.modalComponent.open();
  }

  //check close modal and log out if not touched within 3 min of opening
  checkIfModalIgnored(){
    setTimeout(() => {
      if(this.modalClicked){
        this.modalClicked = false;
      } else {
        this.modalComponent.closeModals();
        this.userApiService.logout();
        this.startUserActivityCheck();
      }
    }, 180000);
  }

  //collect data on which button the user clicked on the modal
  getModalClickValue(value: any) {
    if (value == 'Action click') {
      this.modalClicked = true;
      this.userApiService.isUserAuthorized();
    } else {
      this.userApiService.logout();
      this.stopUserActivityCheck()
    }
  }

  async checkUserLoggedIn(){
    let userLoggedIn = await this.userApiService.setUserAuthorizationStatus();
    if(userLoggedIn){
      this.startUserActivityCheck()
    }
  }

  //set last time the mouse was moved
  @HostListener('mousemove', ['$event'])  
  onMouseMove(e: any) {
    this.lastMouseMove = Date.now();
  }
  
  //check every 10 min if user has moved their mouse in the last 10 min
  startUserActivityCheck() {
    let start = (new Date()).getSeconds()
    this.checkActivityInterval = setInterval(() => {
      let diff = Date.now() - this.lastMouseMove;
      if (diff > 600000) {
        this.open()
      }else{
        this.userApiService.isUserAuthorized();
      }
    }, 600000, start);
  }  

  stopUserActivityCheck(){
    clearInterval(this.checkActivityInterval);
  }

}
