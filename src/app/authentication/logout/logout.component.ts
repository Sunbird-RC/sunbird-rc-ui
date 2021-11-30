import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  baseUrl = this.config.getEnv('baseUrl');
  constructor(public keycloakService: KeycloakService,private config: AppConfig, public router: Router) { }

  ngOnInit(): void {
    localStorage.clear();

    this.keycloakService.clearToken();
    this.keycloakService.logout(window.location.origin);
    // this.router.navigate([''])
  }

}
