import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { environment } from 'src/environments/environment';
import { DataService } from './data-request.service';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  schemaUrl = this.config.getEnv('schemaUrl');
  configFolder = this.config.getEnv('configFolder');

  constructor(public dataService: DataService,private config: AppConfig) {
  }

  getSchemas() {
    let url = `${this.schemaUrl}`;
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getHeaderJSON() {
    let url = `.${this.configFolder}/headers.json`;
    url.replace('//', '/');
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getFormJSON() {
    let url = `.${this.configFolder}/forms.json`;
    url.replace('//', '/');
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getLayoutJSON() {
    let url = `.${this.configFolder}/layouts.json`;
    url.replace('//', '/');
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getTableJSON() {
    let url = `.${this.configFolder}/tables.json`;
    url.replace('//', '/');
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getSearchJSON() {
    let url = `.${this.configFolder}/search.json`;
    url.replace('//', '/');
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getPageJSON() {
    let url = `.${this.configFolder}/pages.json`;
    url.replace('//', '/');
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }


}

