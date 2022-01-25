import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakEvent, KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions } from 'keycloak-js';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
    constructor(
        protected readonly router: Router,
        protected readonly keycloak: KeycloakService
    ) {
        super(router, keycloak);
    }

    public async isAccessAllowed(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<any> {
        // Force the user to log in if currently unauthenticated.
        if (!this.authenticated) {
            /* await this.keycloak.login({
                 redirectUri: window.location.origin + state.url,
             });*/
            this.keycloak
                .getKeycloakInstance()
                .login(<KeycloakLoginOptions>{
                    locale: localStorage.getItem('ELOCKER_LANGUAGE')
                })
                .then((res) => {
                    console.log({ res });
                });
        }

        // Get the roles required from the route.
        const requiredRoles = route.data.roles;

        // Allow the user to to proceed if no additional roles are required to access the route.
        if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
            return true;
        }

        // Allow the user to proceed if all the required roles are present.
        return requiredRoles.every((role) => this.roles.includes(role));
    }
}
