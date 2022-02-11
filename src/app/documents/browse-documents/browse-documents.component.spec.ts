import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseDocumentsComponent } from './browse-documents.component';

describe('BrowseDocumentsComponent', () => {
  let component: BrowseDocumentsComponent;
  let fixture: ComponentFixture<BrowseDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
