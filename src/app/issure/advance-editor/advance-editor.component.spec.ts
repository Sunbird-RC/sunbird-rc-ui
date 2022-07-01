import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceEditorComponent } from './advance-editor.component';

describe('AdvanceEditorComponent', () => {
  let component: AdvanceEditorComponent;
  let fixture: ComponentFixture<AdvanceEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
