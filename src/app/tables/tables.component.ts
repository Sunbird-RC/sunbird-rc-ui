import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '../services/data/schema.service';
import { GeneralService } from '../services/general/general.service';
// import * as TableSchemas from './tables.json'

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  table: any;
  entity: any;
  tab: string = 'attestation'
  tableSchema: any;
  apiUrl: any;
  model: any;
  Data: string[] = [];
  property: any[] = [];
  field;

  page: number = 1;
  limit: number = 10;

  constructor(public router: Router, private route: ActivatedRoute, public generalService: GeneralService, public schemaService: SchemaService) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    var tab_url = this.router.url
    this.route.params.subscribe(async params => {
      this.table = (params['table']).toLowerCase()
      this.entity = (params['entity']).toLowerCase();
      this.tab = tab_url.replace(this.table, "").replace(this.entity, "").split("/").join("")
      this.schemaService.getTableJSON().subscribe(async (TableSchemas) => {
        var filtered = TableSchemas.tables.filter(obj => {
          return Object.keys(obj)[0] === this.table
        })
        this.tableSchema = filtered[0][this.table]
        this.apiUrl = this.tableSchema.api;
        this.limit = filtered[0].hasOwnProperty(this.limit) ? filtered[0].limit : this.limit;
        await this.getData();
      })
      
    });
  }

  getData() {
    var get_url;
    if (this.entity) {
      get_url = this.apiUrl
    } else {
      console.log("Something went wrong")
    }
    this.generalService.getData(get_url).subscribe((res) => {
      this.model = res;
      // this.entity = res[0].osid;
      this.addData()
    });
  }

  addData() {

    var temp_array;
    let temp_object
    this.model.forEach(element => {
      if (element.status === "OPEN") {
        temp_array = [];
        this.tableSchema.fields.forEach((field) => {

          temp_object = field;

          if (temp_object.name) {
            temp_object['value'] = element[field.name]
            temp_object['status'] = element['status']
          }
          if (temp_object.formate) {
            temp_object['formate'] = field.formate
          }
          if (temp_object.custom) {
            if (temp_object.type == "button") {
              if (temp_object.redirectTo && temp_object.redirectTo.includes(":")) {
                let urlParam = temp_object.redirectTo.split(":")
                urlParam.forEach((paramVal, index) => {
                  if (paramVal in element) {
                    urlParam[index] = element[paramVal]
                  }
                });
                temp_object['redirectToUrl'] = urlParam.join("/").replace("//", "/");
              }
            }
            temp_object['type'] = field.type
          }
          temp_array.push(this.pushData(temp_object));
        });
        this.property.push(temp_array)
      }
    });

    this.tableSchema.items = this.property;
  }

  pushData(data) {
    var object = {};
    for (var key in data) {
      if (data.hasOwnProperty(key))
        object[key] = data[key];
    }
    return object;
  }

}
