import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSightComponent } from './new-sight.component';

describe('NewSightComponent', () => {
  let component: NewSightComponent;
  let fixture: ComponentFixture<NewSightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
