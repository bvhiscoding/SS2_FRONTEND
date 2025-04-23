import { inject } from '@angular/core';
import { AppConfigService } from './config.service';

export function injectConfigs() {
  return inject(AppConfigService).getConfig();
}
