import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { ModalInfo } from '@app/core/interfaces/modal.interface';
import { UserApiService } from '@app/core/apiServices/user-api.service';
import { FormService } from '@app/shared/services/form.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  @ViewChild('sharedModal')
  private modalComponent!: ModalComponent;
  public modalInfo!: ModalInfo;
  public emailForm: FormGroup;
  private userService: UserApiService = inject(UserApiService);
  private formService: FormService = inject(FormService)

  constructor(public fb: FormBuilder) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  onSubmit() {
    if (this.emailForm.valid) {
      let email = this.emailForm.get('email')!.value;
      this.userService.isEmailRegistered(email)
        .subscribe((res) => {
          let result: boolean = res.data.emailRegistered;
          if (result) {
            this.userService.sendEmailChangePassword(email)
            .subscribe();
          }
          this.openNotificationModal(result);
        })
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  openNotificationModal(emailRegistered: boolean): void {
    if (emailRegistered) {
      this.modalInfo = {
        style: "modal-style-primary",
        title: "Please check you email",
        body: `Check your inbox for further instructions`,
        btnClass: "btn-blue",
        closeBtnName: "",
        actionBtnName: "Okay",
      }
    } else {
      this.modalInfo = {
        style: "modal-style-danger",
        title: "Email not registered",
        body: `This email is not linked to any registered account`,
        btnClass: "btn-danger",
        closeBtnName: "",
        actionBtnName: "Okay",
      }
    }

    this.open();
  }

  open() {
    this.openModal();
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  getInputError(field: string): string {
    return this.formService.getInputError(field, this.emailForm);
  }
}
