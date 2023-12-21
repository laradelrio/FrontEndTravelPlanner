import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApiService } from '@app/core/apiServices/user-api.service';
import { UserData } from '@app/core/interfaces/user.interface';
import { finalize } from 'rxjs';
import { ImgUploadInputComponent } from '@app/shared/components/img-upload-input/img-upload-input.component';

@Component({
  selector: 'app-user-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImgUploadInputComponent],
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.scss'
})
export class UserProfileEditComponent implements OnInit{

  @Input() profileImg!: string;
  private userApiService: UserApiService = inject(UserApiService);
  public updatePhoto: boolean = false;
  public editUserProfileForm: FormGroup;
  public userData!: UserData;
  public isValidName: boolean = true;
  public isValidEmail: boolean = true; 

  constructor(private fb: FormBuilder,) {
    this.editUserProfileForm = this.fb.group({
      name: ['', [Validators.minLength(2)]],
      email: ['', [Validators.email]],
      photo: ['', []],
    })
  }

  async ngOnInit(): Promise<void> {
    this.getUserData();
  }

  getUserData(): void{
    this.userApiService.getUser(1)
    .pipe(
      finalize( () => {
        this.setFormInitialValues();
      })
    )
    .subscribe( (res) => {
      this.userData = res.data;
    });
  }

  setFormInitialValues(): void{
    this.editUserProfileForm.controls['name'].setValue(this.userData.name);
    this.editUserProfileForm.controls['email'].setValue(this.userData.email);
  }

  handleImageError(event: any):void{
    event.target.src =  "../../../../../assets/user-default.webp";
  }

  showUploadImgInput(): void{
    this.updatePhoto = true;
  }
  
  imgUpload(imgUrl: string | null ): void{
    this.editUserProfileForm.controls['photo'].setValue(imgUrl);
    this.userDataUpdated('photo'); 
    this.updatePhoto = false; 
  }

  userDataUpdated(inputField: string) {
    let inputFieldValue = this.editUserProfileForm.get(`${inputField}`)?.value;
    let valueFound: number = (Object.values(this.userData)).indexOf(`${inputFieldValue}`)

    if(valueFound === -1 && this.editUserProfileForm.controls[`${inputField}`].valid){
      this.userApiService.updateUser(1, {field: inputField, value: inputFieldValue})
      .subscribe({
        next:  (res) => { this.getUserData() },
        error: (err) => { this.isValidEmail = false}
      })
    }
  }

  isValidInput(inputField: string): void{
    let isValid: boolean = this.editUserProfileForm.controls[`${inputField}`].valid
    if(inputField === 'name'){
      this.isValidName = isValid;
    } else{
      this.isValidEmail = isValid;
    }
  }
  
}
