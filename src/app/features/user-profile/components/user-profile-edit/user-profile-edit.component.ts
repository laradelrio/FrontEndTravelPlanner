import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApiService } from '@app/core/apiServices/user-api.service';
import { UserData } from '@app/core/interfaces/user.interface';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.scss'
})
export class UserProfileEditComponent implements OnInit{

  private userApiService: UserApiService = inject(UserApiService);
  public updatePhoto: boolean = false;
  public editUserProfileForm: FormGroup;
  public userData!: UserData;

  constructor(private fb: FormBuilder,) {
    this.editUserProfileForm = this.fb.group({
      name: ['', [Validators.minLength(2)]],
      email: ['', [Validators.email]],
      image: ['', [Validators.minLength(5)]]
    })
  }

  async ngOnInit(): Promise<void> {
    this.getUserData();
  }

  setUpdatePhoto() {
    this.updatePhoto = true;
  }

  getUserData(){
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

  handleImageError(event: any){
    event.target.src =  "../../../../../assets/user-default.webp";
  }
  
  setFormInitialValues(){
    this.editUserProfileForm.controls['name'].setValue(this.userData.name);
    this.editUserProfileForm.controls['email'].setValue(this.userData.email);
  }

  userDataUpdated(inputField: string) {
    let inputFieldValue = this.editUserProfileForm.get(`${inputField}`)?.value;
    let valueFound: number = (Object.values(this.userData)).indexOf(`${inputFieldValue}`)

    console.log('blur')
    //TODO CONTROL IF TEH FIELD IS VALID BEFORE SENDING IT
    if(valueFound === -1){
      this.userApiService.updateUser(1, {field: inputField, value: inputFieldValue})
      .subscribe( (res) => {
        console.log('RES',res);
      })
    }
  }
}
