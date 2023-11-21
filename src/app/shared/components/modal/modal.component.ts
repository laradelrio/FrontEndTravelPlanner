import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  providers: [NgbModalConfig, NgbModal],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  private modalRef!: NgbModalRef;
  
  @ViewChild('sharedModal') private modalContent!: TemplateRef<ModalComponent>

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;

 
  }

  ngOnInit(): void {
  }

  open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { size: 'sm' })
      // this.modalRef.result.then((result) => {
      //   console.log(result);
      //   this.newConfirmationEvent.emit(result);
      // }, (reason) => {
      //   console.log(reason);
      // });
    })
  }
  
}
