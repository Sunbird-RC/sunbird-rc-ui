import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocDetailViewComponent } from './doc-detail-view.component';

describe('DocDetailViewComponent', () => {
  let component: DocDetailViewComponent;
  let fixture: ComponentFixture<DocDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
