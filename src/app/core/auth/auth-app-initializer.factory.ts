import { AuthService } from './auth.service';
import { AppConfigService } from '../config/config.service';
import { OAuthModuleConfig } from 'angular-oauth2-oidc';

export function authAppInitializerFactory(
  authService: AuthService,
): () => Promise<void> {
  return () => authService.runInitialLoginSequence();
}

// export function authConfigInitializerFactory(
//   config: AppConfigService
// ): AuthConfig {
//   return config.getConfig().authConfig;
// }

// export function endpointsInitializerFactory(
//   config: AppConfigService
// ): OAuthModuleConfig {
//   return {
//     resourceServer: {
//       allowedUrls: [
//         config.getConfig().endPoints.RESOURCE_URL,
//         config.getConfig().endPoints.NOTIFICATION_URL,
//       ],
//       sendAccessToken: true,
//     },
//   };
// }
