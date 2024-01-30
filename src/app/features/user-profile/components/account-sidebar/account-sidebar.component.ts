import { Component, OnInit, ViewChild, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { ModalInfo } from '@app/core/interfaces/modal.interface';
import { FormService } from '@app/shared/services/form.service';
import { UserApiService } from '@app/core/apiServices/user-api.service';
import { finalize } from 'rxjs';

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
  private formService: FormService = inject(FormService);
  private userService: UserApiService = inject(UserApiService);

  ngOnInit(): void {
    this.activeSection(this.router.url);
  }

  openDeleteModal(){
    this.modalInfo = this.formService.getDeleteModalInfo('your account');
    this.open();
  }

  open() {
    this.openModal();
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  deleteUser(value: string){
    if(value === 'Action click'){
      let userId = parseInt(localStorage.getItem('userId')!);
      this.userService.deleteUser(userId)
      .pipe(
        finalize( () => {
          this.userService.logout(); 
          setTimeout(() => {
              this.router.navigate(['/home']);
          }, 1000);
        })
      )
      .subscribe((res) => {
        if(res.success){
          this.openSuccessModal();          
        }
      });
    }
  }

  openSuccessModal(): void{
    // this.modalInfo = this.formService.getDeleteModalInfo('DSFRYJKU5TMNRBEGREFWD');
    this.modalInfo = this.formService.getSuccessModalInfo('Account deleted', 'Your account has been permanently deleted');
    this.open();
  }
  
  activeSection(navLink: string): string {
    if(this.router.url === navLink){
      return 'active'
    }
    return ""
  } 
  
}
