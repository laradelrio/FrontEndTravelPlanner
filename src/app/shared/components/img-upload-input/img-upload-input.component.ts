import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormService } from '@app/shared/services/form.service';

@Component({
  selector: 'app-img-upload-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './img-upload-input.component.html',
  styleUrl: './img-upload-input.component.scss'
})
export class ImgUploadInputComponent {

  @Output() imageLink = new EventEmitter<string>();
  private formService: FormService = inject(FormService);

  onFileSelected(event: any): void {
    this.formService.uploadImg(event.target.files[0])
      .subscribe((res) => {
        if (res.success) {
          this.imageLink.emit(res.data.display_url);
        }
      })
  }

}
