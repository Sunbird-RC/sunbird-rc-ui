import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecordsComponent } from './add-records.component';

describe('AddRecordsComponent', () => {
  let component: AddRecordsComponent;
  let fixture: ComponentFixture<AddRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
