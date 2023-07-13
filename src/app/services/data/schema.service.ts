import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
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
    const url = `${this.schemaUrl}`;
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getHeaderJSON() {
    const url = `.${this.configFolder}/headers.json`;
    url.replace('//', '/');
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getFormJSON() {
    const url = `.${this.configFolder}/forms.json`;
    url.replace('//', '/');
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getLayoutJSON() {
    const url = `.${this.configFolder}/layouts.json`;
    url.replace('//', '/');
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getTableJSON() {
    const url = `.${this.configFolder}/tables.json`;
    url.replace('//', '/');
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getSearchJSON() {
    const url = `.${this.configFolder}/search.json`;
    url.replace('//', '/');
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getPageJSON() {
    const url = `.${this.configFolder}/pages.json`;
    url.replace('//', '/');
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }


}

