import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserApiService } from '@app/core/apiServices/user-api.service';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { ModalInfo } from '@app/core/interfaces/modal.interface';
import { ApiResp } from '@app/core/interfaces/apiResponses.interface';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit{

  @ViewChild('sharedModal')
  private modalComponent!: ModalComponent;
  public modalInfo!: ModalInfo;
  public resetPasswordForm: FormGroup;
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private userService: UserApiService = inject(UserApiService);
  
  constructor( public fb: FormBuilder){
    this.resetPasswordForm = this.fb.group({
      encryptedUserId: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmed: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.resetPasswordForm.controls['passwordConfirmed'].addValidators(this.isSamePassword.bind(this));
    this.resetPasswordForm.controls['encryptedUserId'].setValue(this.activatedRoute.snapshot.url[1].path);
  }

  isSamePassword(control: AbstractControl): { [key: string]: any } | null {
    let returnValue: { [key: string]: any } | null = { isSamePassword: false }
    let password = this.resetPasswordForm.controls['password'].value;
    let passwordConfirmed = control.value;
    if (password === passwordConfirmed){
        returnValue = null;
    }
    return returnValue;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.userService.changePassword(this.resetPasswordForm)
        .subscribe((res) => {
          this.openNotificationModal(res);
        })
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }


  openNotificationModal(passwordChangeResult: ApiResp): void {
    if (passwordChangeResult.success) {
      this.modalInfo = {
        style: "modal-style-primary",
        title: "",
        body: `Password changed successfully`,
        btnClass: "btn-blue",
        closeBtnName: "",
        actionBtnName: "Okay",
      }
    } else {
      this.modalInfo = {
        style: "modal-style-danger",
        title: "Password Reset unsuccessful not registered",
        body: `${passwordChangeResult.message}`,
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


}
