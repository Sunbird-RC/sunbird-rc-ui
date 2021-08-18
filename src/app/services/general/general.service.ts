import { Injectable } from '@angular/core';
import { DataService } from '../../services/data/data-request.service';
import { environment} from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  baseUrl = environment.baseUrl;

  constructor(public dataService: DataService) {
  }

  postData(apiUrl,data) {
    let url = `${this.baseUrl}${apiUrl}`;
    const req = {
      url: url,
      data: data
    };

    return this.dataService.post(req);
  }


  getData(apiUrl, outside: boolean = false) {
    var url;
    if(outside) {
      url = apiUrl;
    }
    else{
      url = `${this.baseUrl}${apiUrl}`;
    }
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getPrefillData(apiUrl) {
    var url = apiUrl;
    let headers = new HttpHeaders();
    const req = {
      url: url,
      headers: headers
    };

    return this.dataService.get(req);
  }

  postPrefillData(apiUrl, data) {
    const req = {
      url: apiUrl,
      data: data
    };

    return this.dataService.post(req);
  }

  putData(apiUrl,id, data) {
    let url = `${this.baseUrl}${apiUrl}/${id}`;
    const req = {
      url: url,
      data: data
    };
    return this.dataService.put(req);
  }


}

