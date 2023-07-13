import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
    providedIn: 'root',
})
export class KeyCloakLogin {
    user;
    constructor(
        protected readonly router: Router,
        protected readonly keycloak: KeycloakService
    ) {
    }

    ngOnInit(): void {
    
    
        this.user = this.keycloak.getUsername();
        this.keycloak.getToken().then((token)=>{
          console.log('keyCloak token - ', token);
          localStorage.setItem('token', token);
          localStorage.setItem('loggedInUser', this.user)
        });

}
}