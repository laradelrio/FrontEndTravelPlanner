import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSightComponent } from './edit-sight.component';

describe('EditSightComponent', () => {
  let component: EditSightComponent;
  let fixture: ComponentFixture<EditSightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
