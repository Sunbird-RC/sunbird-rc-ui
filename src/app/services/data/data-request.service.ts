import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of as observableOf, throwError as observableThrowError, Observable, Subscriber } from 'rxjs';
import { HttpOptions } from '../../interfaces/httpOptions.interface';
import { mergeMap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { environment} from '../../../environments/environment';
import { KeycloakService } from 'keycloak-angular';


@Injectable({
  providedIn: 'root'
})
export class DataService {
/**
 * Contains base Url for api end points
 */
 baseUrl: string;
 token : any;
 isLoogedIn;
  constructor(
    private http: HttpClient,
    public keycloak: KeycloakService) {
      this.token = localStorage.getItem('token');
  }

/**
 * for preparing headers
 */
  private getHeader(headers?: HttpOptions['headers']): HttpOptions['headers'] {

    // const default_headers = {
    //   Accept: 'application/json',
    //  Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwWVVYSmtQRWVJajhpTjE3TW5DSm1kaU1Eby1rdDl6dXNPMVZCaUJZWnpVIn0.eyJleHAiOjE2NDA2ODU3NTIsImlhdCI6MTYyMzQwNTc1MiwianRpIjoiOWFkNGNhZDgtN2Y3NS00MWJiLWI0NzUtYTM4ODlmZWViOTU2IiwiaXNzIjoiaHR0cDovL25kZWFyLnhpdi5pbi9hdXRoL3JlYWxtcy9uZGVhciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI5NTZhZDAxMS1kNjg5LTQ4YTYtYjExNS05YTQ0Y2FkMzZlOTciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJyZWdpc3RyeS1mcm9udGVuZCIsInNlc3Npb25fc3RhdGUiOiI5MDJjNzliZC1hN2NjLTQwYzktYjk2Zi03NjE4YmRjZmJhNTEiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vbG9jYWxob3N0OjQyMDIiLCJodHRwOi8vbG9jYWxob3N0OjQyMDIiLCJodHRwczovL2xvY2FsaG9zdDo0MjAwIiwiaHR0cDovL2xvY2FsaG9zdDo0MjAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuZXd1c2VyMTMiLCJlbnRpdHkiOlsiU3R1ZGVudCJdfQ.IFZzCRNhsZb1-j6tl20Ai6Qn7_sWCJsMh-0EvlU6fMnhYz-s2BjXYT2uNH1vtpKD333jbGSuIHkQmgvi8sABZWbfMK2XEQbIJYArhHZ4awJG3syqo2vdCsFCQlVYySB1wqQKV5IwKW0a66LXy1fhMZS9zUhSzu1Nix-Odm-2tMZoI5sa8YbbTIi1HJFM5Mg886lzDXwYBjHxDALLq7yG1LtJsnfPhKAsnezFxrW6Bblm00KYf0aOLdpSRCekmpQxshLxbL6RD3EZ0I2Yyz_-3hhxP8DAFPel9FhxyDnAzmZ51ePSVulxVEXAjbdUc8gzDzZPJ0DmwALDnj0rb0LiiQ',
    // };

    this.keycloak.isLoggedIn().then((res)=>{
      console.log(res);
      this.isLoogedIn = res;
    })

    if(this.isLoogedIn){
     // alert(this.keycloak.isLoggedIn);
      let default_headers = {
        Accept: 'application/json',
         Authorization: 'Bearer ' +  this.token
      };

      return default_headers;

    }else
    {
      let default_headers = {
        Accept: 'application/json'
      };
      
      return default_headers;

    }
   

  }

/**
 * for making post api calls
 * @param RequestParam param
 */
  post(requestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };

    return this.http.post(requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: any) => {
        if (data.responseCode && data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }


/**
 * for making get api calls
 *
 * @param requestParam param
 */
  get(requestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };

    return this.http.get(requestParam.url, httpOptions).pipe(
      mergeMap((data: any) => {

        return observableOf(data);
      }));

  }

  getDocument(url: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
        let objectUrl: string = null;

        this.http
            .get(url, {
                headers: this.getHeader(),
                responseType: 'blob'
            })
            .subscribe(m => {
                objectUrl = URL.createObjectURL(m);
                observer.next(objectUrl);
            });

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
                objectUrl = null;
            }
        };
    });
}


// /**
// * for making post api calls
// * @param RequestParam param
// */
// put(requestParam): Observable<any> {
//   const httpOptions: HttpOptions = {
//     headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
//     params: requestParam.param
//   };
//   return this.http.put(requestParam.url, requestParam.data, httpOptions).pipe(
//     mergeMap((data: any) => {
//       // if (data.responseCode !== 'OK') {
//       //   return observableThrowError(data);
//       // }
//       return observableOf(data);
//     }));
// }


/**
* for making post api calls
* @param RequestParam param
*/
  put(requestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };
    return this.http.put(requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: any) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }

}


