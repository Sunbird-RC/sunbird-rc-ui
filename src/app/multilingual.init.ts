import { catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import {  TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

export function initLang(http: HttpClient, translate: TranslateService) {
  
  return ()  => {
  
    
    const defaultSetLanguage = 'en';
    const localUrl = '/assets/i18n/local';
    const globalUrl = '/assets/i18n/global';

    const sufix = '.json';
    const local = '-local';
    const global = '-global';

    const storageLocale = localStorage.getItem('setLanguage');
    const setLanguage = storageLocale || defaultSetLanguage;

    forkJoin([
      http.get(`${localUrl}/${setLanguage}${local}${sufix}`).pipe(
        catchError(() => of(null))
      ),
      http.get(`${globalUrl}/${setLanguage}${global}${sufix}`).pipe(
        catchError(() => of(null))
      )
    ]).subscribe((response: any[]) => {
      const devKeys = response[0];
      const translatedKeys = response[1];

      translate.setTranslation(defaultSetLanguage, devKeys || {});
      translate.setTranslation(setLanguage, translatedKeys || {}, true);

      translate.setDefaultLang(defaultSetLanguage);
      translate.use(setLanguage);

    });
  };
}