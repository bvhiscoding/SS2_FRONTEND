import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../environment';

export const authCodeFlowConfig: Partial<any> = {
  issuer: environment.API_URL,
  tokenEndpoint: environment.API_URL + '/connect/token',
  userinfoEndpoint: environment.API_URL + '/connect/userinfo',
  clientId: 'pm',
  responseType: 'code',
  silentRefreshRedirectUri:
    window.location.origin + '/assets/silent-refresh.html',
  dummyClientSecret: '$,Zf.EXS@quyb}DYC8{@i]P{!?*J=k',
  scope: 'offline_access roles profile openid',
  // customQueryParams: {
  //   grant_type: 'code',
  // },
  useSilentRefresh: true,
  silentRefreshTimeout: 5000, // Timeout for silent refresh
  sessionChecksEnabled: true, // Enables session checks
  // showDebugInformation: true,
  oidc: false,
};
