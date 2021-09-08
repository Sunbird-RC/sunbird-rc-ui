
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
    return () =>
        keycloak.init({
            config: {
                url: environment.keycloakConfig.url,
                realm: environment.keycloakConfig.realm,
                clientId: environment.keycloakConfig.clientId
            },
            initOptions: {
                checkLoginIframe: true,
                checkLoginIframeInterval: 25

            },
            loadUserProfileAtStartUp: true
        });

}
