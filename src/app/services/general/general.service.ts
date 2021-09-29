import { Injectable } from '@angular/core';
import { DataService } from '../data/data-request.service';
import { environment} from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  baseUrl = this.config.getEnv('baseUrl');

  constructor(public dataService: DataService, private config: AppConfig) {
  }

  postData(apiUrl,data) {
    let url = `${this.baseUrl}/${apiUrl}`;
    url.replace('//', '/');
    const req = {
      url: url,
      data: data
    };

    return this.dataService.post(req);
  }

  getDocument(url: string): Observable<any> {
    return this.dataService.getDocument(url);
}


  getData(apiUrl, outside: boolean = false) {
    var url;
    if(outside) {
      url = apiUrl;
    }
    else{
      url = `${this.baseUrl}/${apiUrl}`;
    }
    url.replace('//', '/');
    const req = {
      url: url
    };
    return this.dataService.get(req);
  }

  getPrefillData(apiUrl) {
    var url = apiUrl;
    let headers = new HttpHeaders();
    url.replace('//', '/');
    const req = {
      url: url,
      headers: headers
    };

    return this.dataService.get(req);
  }

  postPrefillData(apiUrl, data) {
    apiUrl.replace('//', '/');
    const req = {
      url: apiUrl,
      data: data
    };

    return this.dataService.post(req);
  }

  putData(apiUrl,id, data) {
    let url = `${this.baseUrl}/${apiUrl}/${id}`;
    url.replace('//', '/').replace('//', '/');
    const req = {
      url: url,
      data: data
    };
    return this.dataService.put(req);
  }

  // Configurations
  getConfigs() {
    let url = "./assets/config/config.json";
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

}

