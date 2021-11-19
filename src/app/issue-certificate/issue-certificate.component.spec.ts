import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCertificateComponent } from './issue-certificate.component';

describe('IssueCertificateComponent', () => {
  let component: IssueCertificateComponent;
  let fixture: ComponentFixture<IssueCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
