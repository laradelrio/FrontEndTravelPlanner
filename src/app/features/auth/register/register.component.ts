import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Form } from '@app/core/interfaces/form.interface';
import { FormService } from '@app/shared/services/form.service';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@app/shared/components/modal/modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [NgbModalConfig, NgbModal],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  //for modal
  private modalRef!: NgbModalRef;
  @ViewChild('registerModal') private modalContent!: TemplateRef<RegisterComponent>

  //for form
  private formService: FormService;
  registerForm: FormGroup;

  signUpForm: Form[] = [
    { name: 'username', label: 'Username' , type:'text' },
    { name: 'email', label: 'Email Address',type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'passwordConfirmation', label: 'Repeat Password', type: 'password' },
  ]

  constructor(
    private fb: FormBuilder,
    private router: Router,
    config: NgbModalConfig, private modalService: NgbModal
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.formService = inject(FormService);

    config.backdrop = 'static';
    config.keyboard = false;
  }
  
  isValidInput(input: string): boolean | null{
    return this.registerForm.controls[input].errors && this.registerForm.controls[input].touched;
  }

  getInputError(field: string): string {
    return this.formService.getInputError(field, this.registerForm);
  }

  onSubmitRegister(){
    this.registerForm.markAllAsTouched();
    if(this.registerForm.valid){
      
    }
  }

 

  openModal(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { size: 'lg', centered: true })
      // this.modalRef.result.then((result) => {
      //   console.log(result);
      //   this.newConfirmationEvent.emit(result);
      // }, (reason) => {
      //   console.log(reason);
      // });
    })
  }

}
