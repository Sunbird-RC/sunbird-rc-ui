import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataService } from './data-request.service';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  schemaUrl = environment.schemaUrl;

  constructor(public dataService: DataService) {
  }

  getSchemas() {
    let url = `${this.schemaUrl}`;
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getFormJSON() {
    let url = "./assets/config/forms.json";
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getLayoutJSON() {
    let url = "./assets/config/layouts.json";
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }

  getTableJSON() {
    let url = "./assets/config/tables.json";
    const req = {
      url: url
    };

    return this.dataService.get(req);
  }


}

