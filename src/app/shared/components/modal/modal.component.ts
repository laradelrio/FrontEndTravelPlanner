import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalInfo } from '@app/core/interfaces/modal.interface';


@Component({
  selector: 'app-shared-modal',
  standalone: true,
  imports: [CommonModule],
  providers: [NgbModalConfig, NgbModal],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  private modalRef!: NgbModalRef;
  @Input() content!: ModalInfo;
  @Input() set modalInfo(value: ModalInfo){
    this.content = value;
  }
  @ViewChild('sharedModal') private modalContent!: TemplateRef<ModalComponent>
  @Output() buttonClick = new EventEmitter<string>();
  
  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { size: 'sm' })
      this.modalRef.result.then((result) => {
      this.buttonClick.emit(result);
      }, (reason) => {});
    })
  }

  openXL(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { size: 'lg' })
      this.modalRef.result.then((result) => {
      this.buttonClick.emit(result);
      }, (reason) => {});
    })
  }

  closeModals(){
    this.modalService.dismissAll()
  }
  
}
