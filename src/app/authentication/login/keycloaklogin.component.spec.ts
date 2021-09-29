import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeycloakloginComponent } from './keycloaklogin.component';

describe('KeycloakloginComponent', () => {
  let component: KeycloakloginComponent;
  let fixture: ComponentFixture<KeycloakloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeycloakloginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeycloakloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
