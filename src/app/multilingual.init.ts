import { catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

import {  TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

export function initLang(http: HttpClient, translate: TranslateService) {
  
  return () => {
    const defaultELOCKER_LANGUAGE = 'en';
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

    const storageLocale = localStorage.getItem('ELOCKER_LANGUAGE');
    const ELOCKER_LANGUAGE = storageLocale || defaultELOCKER_LANGUAGE;
    var translatedKeys;
    var languageUrl;

 http.get('./assets/config/config.json').subscribe((res)=>{
   languageUrl = res['languageUrl'];
   console.log();
   var installed_languages = [];

    forkJoin([
      http.post(languageUrl, globalReqBody, {headers : headers}).pipe(
        catchError(() => of(null))
      )
    ]).subscribe((response: any[]) => {
       translatedKeys = response[0];

     if(response[0] != null && response[0].length){
     for(let i = 0; i < response[0].length; i++){
       console.log(response[0][i].language);
       if(response[0][i].language == ELOCKER_LANGUAGE)
       {
          translatedKeys = response[0][i].messages;
       }
     }

     for(let i = 0; i < response[0].length; i++){
         installed_languages.push({
           "code": response[0][i].language,
           "name": (response[0][i].name).charAt(0).toUpperCase() + (response[0][i].name).slice(1).toLowerCase()
         });
    }

     localStorage.setItem('languages', JSON.stringify(installed_languages));

    }

      translate.setTranslation(ELOCKER_LANGUAGE, translatedKeys || {}, true);

      translate.setDefaultLang(defaultELOCKER_LANGUAGE);
      translate.use(ELOCKER_LANGUAGE);

    });
  });
}
}
