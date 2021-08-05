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


  getData(apiUrl) {
    let url = `${this.baseUrl}${apiUrl}`;
    // let headers = new HttpHeaders();
    // headers.set("Authorization","Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwWVVYSmtQRWVJajhpTjE3TW5DSm1kaU1Eby1rdDl6dXNPMVZCaUJZWnpVIn0.eyJleHAiOjE2NDA2ODU3NTIsImlhdCI6MTYyMzQwNTc1MiwianRpIjoiOWFkNGNhZDgtN2Y3NS00MWJiLWI0NzUtYTM4ODlmZWViOTU2IiwiaXNzIjoiaHR0cDovL25kZWFyLnhpdi5pbi9hdXRoL3JlYWxtcy9uZGVhciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI5NTZhZDAxMS1kNjg5LTQ4YTYtYjExNS05YTQ0Y2FkMzZlOTciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJyZWdpc3RyeS1mcm9udGVuZCIsInNlc3Npb25fc3RhdGUiOiI5MDJjNzliZC1hN2NjLTQwYzktYjk2Zi03NjE4YmRjZmJhNTEiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vbG9jYWxob3N0OjQyMDIiLCJodHRwOi8vbG9jYWxob3N0OjQyMDIiLCJodHRwczovL2xvY2FsaG9zdDo0MjAwIiwiaHR0cDovL2xvY2FsaG9zdDo0MjAwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuZXd1c2VyMTMiLCJlbnRpdHkiOlsiU3R1ZGVudCJdfQ.IFZzCRNhsZb1-j6tl20Ai6Qn7_sWCJsMh-0EvlU6fMnhYz-s2BjXYT2uNH1vtpKD333jbGSuIHkQmgvi8sABZWbfMK2XEQbIJYArhHZ4awJG3syqo2vdCsFCQlVYySB1wqQKV5IwKW0a66LXy1fhMZS9zUhSzu1Nix-Odm-2tMZoI5sa8YbbTIi1HJFM5Mg886lzDXwYBjHxDALLq7yG1LtJsnfPhKAsnezFxrW6Bblm00KYf0aOLdpSRCekmpQxshLxbL6RD3EZ0I2Yyz_-3hhxP8DAFPel9FhxyDnAzmZ51ePSVulxVEXAjbdUc8gzDzZPJ0DmwALDnj0rb0LiiQ");
    const req = {
      url: url
    };

    return this.dataService.get(req);
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

