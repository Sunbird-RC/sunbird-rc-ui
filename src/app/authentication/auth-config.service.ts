import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthConfigService {
  private config: any;

  constructor(private httpClient: HttpClient) {}

  public getConfig(): Observable<any> {
    return this.httpClient
        .get('./assets/config/config.json', {
          observe: 'response',
        })
        .pipe(
          catchError((error) => {
            console.log(error)
            return of(null)
          } ),
          mergeMap((response) => {
            if (response && response.body) {
              this.config = response.body;
              return of(this.config);
            } else {
              return of(null);
            }
          }));
  }
}
