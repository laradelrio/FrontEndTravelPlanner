import { Component, EventEmitter, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Form } from '@app/core/interfaces/form.interface';
import { FormService } from '@app/shared/services/form.service';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserApiService } from '@app/core/apiServices/user-api.service';
import { finalize } from 'rxjs';
import { UserApiResp } from '@app/core/interfaces/apiResponses.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [NgbModalConfig, NgbModal],
  templateUrl: './login.component.html',
  styleUrl: '../auth.component.scss'
})
export class LoginComponent {

  @Output() openRegisterClicked = new EventEmitter<void>();

  //for modal
  private modalRef!: NgbModalRef;
  @ViewChild('loginModal') private modalContent!: TemplateRef<LoginComponent>

  //for form
  private userApiService: UserApiService = inject(UserApiService);
  private formService: FormService = inject(FormService);
  public loginForm: FormGroup;
  public loginResponse: UserApiResp = { success: false, message: '' };


  signInForm: Form[] = [
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
  ]

  constructor(
    private fb: FormBuilder,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    config.backdrop = 'static';
    config.keyboard = false;
  }

  isValidInput(input: string): boolean | null {
    return this.loginForm.controls[input].errors && this.loginForm.controls[input].touched;
  }

  getInputError(field: string): string {
    return this.formService.getInputError(field, this.loginForm);
  }

  onSubmitLogin() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      this.userApiService.loginUser(this.loginForm)
        .pipe(
          finalize(() => {
            if (this.loginResponse.success) {
              this.loginForm.reset();
              this.router.navigate(['/home']);
              this.modalService.dismissAll();
            }
            this.userApiService.isLoggedIn.set(this.loginResponse.success)
          })
        )
        .subscribe({
          next: (res) => (this.loginResponse = res, console.log(res)),
          error: (error) => (this.loginResponse = error.error, console.log(error))
        })
    }
  }

  openModal(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { size: 'lg', centered: true })
    })
  }

  openRegister(){
    this.modalService.dismissAll();
    this.openRegisterClicked.emit();
  }

}
