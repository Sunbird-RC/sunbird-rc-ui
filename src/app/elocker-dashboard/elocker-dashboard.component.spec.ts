import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElockerDashboardComponent } from './elocker-dashboard.component';

describe('ElockerDashboardComponent', () => {
  let component: ElockerDashboardComponent;
  let fixture: ComponentFixture<ElockerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElockerDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElockerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
