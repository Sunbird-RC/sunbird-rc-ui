export const environment = {
  production: true,
  baseUrl: 'https://ndear.xiv.in/registry/api/v1',
  schemaUrl: 'https://ndear.xiv.in/registry/api/docs/swagger.json', //asset path OR URL
  logo: 'assets/images/logo.png', //asset path OR URL
  keycloakConfig: {
    url: 'https://ndear.xiv.in/auth',
    realm: 'ndear',
    clientId: 'registry-frontend'
  }
};
