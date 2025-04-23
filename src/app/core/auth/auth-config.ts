import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: Partial<AuthConfig> = {
  // Url of the Identity Provider
  issuer: 'https://id-test.trueconnect.vn',
  clientId: 'localhost_identity_short',
  responseType: 'code',
  oidc: false,
  dummyClientSecret: 'no_important',
  redirectUri: 'http://localhost:4200',
  scope: 'openid profile email offline_access',
  clearHashAfterLogin: false,
};
