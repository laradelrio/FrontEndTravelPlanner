import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestfeatureComponent } from './testfeature.component';

describe('TestfeatureComponent', () => {
  let component: TestfeatureComponent;
  let fixture: ComponentFixture<TestfeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestfeatureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestfeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
