import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminFormService {

  constructor(
   private httpClient: HttpClient
  ) {
  }

  /**
   * For get event list 
   */
  getSchema(url) {
     return this.httpClient.get(url,  {responseType: 'json'});
  }

  getHeroes(url): Observable<any> {
    return this.httpClient.get<any>(url)
  }

}
