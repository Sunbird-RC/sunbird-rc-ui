import { catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import {  TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

export function initLang(http: HttpClient, translate: TranslateService) {
  
  return () => new Promise<boolean>((resolve: (res: boolean) => void) => {
    const defaultSetLanguage = 'en';
    const localUrl = '/assets/i18n/local';
    const globalUrl = '/assets/i18n/global';
    const globalReqBody = {
      "entityType": [
        "Localization"
      ],
      "filters": {
      }
    }

    const headers = {
      'Content-Type': 'application/json'
  }

    const sufix = '.json';
    const local = '-local';
    const global = '-global';

    const storageLocale = localStorage.getItem('setLanguage');
    const setLanguage = storageLocale || defaultSetLanguage;
    var translatedKeys;
    var languageUrl;

 http.get('./assets/config/config.json').subscribe((res)=>{
   languageUrl = res['languageUrl'];
   console.log();

    forkJoin([
      http.get(`${localUrl}/${setLanguage}${local}${sufix}`).pipe(
        catchError(() => of(null))
      ),
      http.post(languageUrl, globalReqBody, {headers : headers}).pipe(
        catchError(() => of(null))
      ),
      // http.get(`${globalUrl}/${setLanguage}${global}${sufix}`).pipe(
      //   catchError(() => of(null))
      // )
    ]).subscribe((response: any[]) => {
      const devKeys = response[0];
     // const translatedKeys = response[1];

     if(response[1] != null && response[1].length){
     for(let i = 0; i < response[1].length; i++){
       console.log(response[1][i].language);
       if(response[1][i].language == setLanguage)
       {
          translatedKeys = response[1][i].messages;
       }
     }
    }

      translate.setTranslation(defaultSetLanguage, devKeys || {});
      translate.setTranslation(setLanguage, translatedKeys || {}, true);

      translate.setDefaultLang(defaultSetLanguage);
      translate.use(setLanguage);

      resolve(true);
    });
  });
})
}
