// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { GeneralService } from "src/app/services/general/general.service";

export const environment = {
  production: false,
  baseUrl: '',
  schemaUrl: 'assets/config/schema.json', //asset path OR URL
  logo: 'assets/images/logo.png', //asset path OR URL
  keycloakConfig: {
    url: 'https://ndear.xiv.in/auth',
    realm: 'ndear',
    clientId: 'registry-frontend'
  }
};
