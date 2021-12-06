
import { KeycloakService } from 'keycloak-angular';
import { switchMap } from 'rxjs/operators';
import { from as fromPromise, Observable } from 'rxjs';
import { AuthConfigService } from '../authentication/auth-config.service';

export function initializeKeycloak(keycloak: KeycloakService, configService: AuthConfigService) {
    return () =>
        configService.getConfig()
            .pipe(
                switchMap<any, any>((config) => {
                    console.log('conf---',config);
                    if(config && config.keycloak){
                        return fromPromise(keycloak.init({
                            config: {
                                url: config['keycloak']['url'],
                                realm: config['keycloak']['realm'],
                                clientId: config['keycloak']['clientId'],
                            },
                            initOptions: {
                                checkLoginIframe: true,
                                checkLoginIframeInterval: 25
                            },
                            loadUserProfileAtStartUp: true
                        }))
                    }else{
                        return fromPromise(keycloak.init({
                            config: {
                                url: 'https://skills.xiv.in/auth',
                                realm: 'skills',
                                clientId: 'registry-frontend',
                            },
                            initOptions: {
                                checkLoginIframe: true,
                                checkLoginIframeInterval: 25
                            },
                            loadUserProfileAtStartUp: true
                        }))
                    }
                })
            ).toPromise()
}
//     return () =>
//         keycloak.init({
//             config: {
//                 url: 'https://ndear.xiv.in/auth',
//                 realm: 'ndear',
//                 clientId: 'registry-frontend',
//             },
//             initOptions: {
//                 checkLoginIframe: true,
//                 checkLoginIframeInterval: 25
//             },
//             loadUserProfileAtStartUp: true
//         });
// }
