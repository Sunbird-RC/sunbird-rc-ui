import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetRecordsComponent } from './get-records.component';

describe('GetRecordsComponent', () => {
  let component: GetRecordsComponent;
  let fixture: ComponentFixture<GetRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
