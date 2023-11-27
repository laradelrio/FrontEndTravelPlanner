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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [NgbModalConfig, NgbModal],
  templateUrl: './register.component.html',
  styleUrl: '../auth.component.scss'
})
export class RegisterComponent {

  @Output() openLoginClicked = new EventEmitter<void>();

  //for modal
  private modalRef!: NgbModalRef;
  @ViewChild('registerModal') private modalContent!: TemplateRef<RegisterComponent>

  //for form
  private userApiService: UserApiService = inject(UserApiService);
  private formService: FormService = inject(FormService);
  public registerForm: FormGroup;
  public registrationResponse: UserApiResp = { success: false,  message: '' }
  public secondsLeftTillRedirect: number = 3;
  private router = inject(Router)

  signUpForm: Form[] = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'passwordConfirmation', label: 'Repeat Password', type: 'password' },
  ]

  constructor(
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(6)]]
    });

    config.backdrop = 'static';
    config.keyboard = false;
  }

  isValidInput(input: string): boolean | null {
    return this.registerForm.controls[input].errors && this.registerForm.controls[input].touched;
  }

  getInputError(field: string): string {
    return this.formService.getInputError(field, this.registerForm);
  }

  onSubmitRegister() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      if (this.samePassword()) {
        this.userApiService.registerUser(this.registerForm)
          .pipe(
            finalize(() => { 
              if(this.registrationResponse.success){
                this.loginRedirectAfterSubmit()
              }
          })
          )
          .subscribe({
            next: (res) => (this.registrationResponse = res),
            error: (error) => (this.registrationResponse = error.error)
          })
      } else {
        this.registrationResponse = { success: false, message: "Passwords don't match" }
      }
    }
  }

  samePassword(): boolean {
    return (this.registerForm.get('password')?.value === this.registerForm.get('passwordConfirmation')?.value);
  }


  loginRedirectAfterSubmit() {
    let counter = this.countdownTillLoginRedirect();
    setTimeout(() => {
      this.modalService.dismissAll();
      this.openLoginClicked.emit()
      clearInterval(counter);
    }, 3000);
  }

  countdownTillLoginRedirect() {
    let start = (new Date()).getSeconds()
    let counter = setInterval(() => {
      let now = (new Date).getSeconds();
      let countdownSeconds = Math.floor((now - start));
      this.secondsLeftTillRedirect = 3 - countdownSeconds;
    }, 1000, start);
    return counter
  }

  openModal(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { size: 'lg', centered: true })
    })
  }

  openLogin(){
    this.modalService.dismissAll();
    this.openLoginClicked.emit();
  }

}
