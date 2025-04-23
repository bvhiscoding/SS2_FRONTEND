import { Injectable } from '@angular/core';
import { AppConfig } from './config.model';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService<T extends AppConfig = AppConfig> {
  static appConfig: AppConfig;
  constructor() {}

  static loadConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
      const oReq = new XMLHttpRequest();
      oReq.addEventListener('load', (resp) => {
        if (oReq.status === 200) {
          try {
            AppConfigService.appConfig = JSON.parse(oReq.responseText);
          } catch (e) {
            reject(e);
          }
          resolve();
        } else {
          reject(oReq.statusText);
        }
      });
      oReq.open('GET', '/configuration/config.json');
      oReq.send();
    });
  }

  getConfig(): T {
    return AppConfigService.appConfig as T;
  }
}
