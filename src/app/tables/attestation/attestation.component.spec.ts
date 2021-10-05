import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationComponent } from './attestation.component';

describe('AttestationComponent', () => {
  let component: AttestationComponent;
  let fixture: ComponentFixture<AttestationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttestationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
