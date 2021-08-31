import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../services/general/general.service';
import * as TableSchemas from './tables.json'

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
  // tr: any[] = [];

  constructor(public router: Router, private route: ActivatedRoute, public generalService: GeneralService) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    
    console.log("router",this.router.url)
    var tab_url = this.router.url
    this.route.params.subscribe(async params => {
      console.log("-------------------",params)
      this.table = (params['table']).toLowerCase()
      this.entity = (params['entity']).toLowerCase();
      this.tab = tab_url.replace(this.table,"").replace(this.entity,"").split("/").join("")
      console.log("tab",this.tab)
      var filtered = TableSchemas.tables.filter(obj => {
        // console.log(Object.keys(obj)[0])
        return Object.keys(obj)[0] === this.table
      })
      // console.log(filtered)
      this.tableSchema = filtered[0][this.table]
      this.apiUrl = this.tableSchema.api;
      await this.getData();
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
      console.log("get",res );
      this.model = res;
      // this.entity = res[0].osid;
      this.addData()
    });
  }

  addData() {
    // this.tableSchema.fields.forEach((field)=>{
      
    //   var fieldName = ""
    //   if(field.title){
    //     fieldName = field.title
    //   }else{
    //     fieldName = field.name
    //   }
    //   this.tr.push(fieldName)
    //   console.log("tr",this.tr)
    // })
    console.log("model",this.model)

    var temp_array;
    this.model.forEach(element => {
      if(element.status === "OPEN"){
        temp_array = [];
      this.tableSchema.fields.forEach((field)=>{
        // console.log("field",element[field.name])

        // var temp_object = {}
        if(field.name){
          field['value'] = element[field.name]
          field['status'] = element['status']
          // console.log("field",field)
        }
        if(field.formate){
          field['formate'] = field.formate
          // console.log("field",field)
        }
        if(field.custom){
          if(field.type == "button"){
            var redirectUrl;
            if(field.redirectTo && field.redirectTo.includes(":")){
              var urlParam = field.redirectTo.split(":")
              urlParam.forEach((paramVal, index) => {
                if(paramVal in element){
                  urlParam[index] = element[paramVal]
                }
              });
              redirectUrl = urlParam.join("/").replace("//","/")
              field.redirectTo = redirectUrl;
            }
            
            // console.log("redirectUrl",redirectUrl)
          }
          field['type'] = field.type
        }
        temp_array.push(field)
      });
      console.log("temp_array",temp_array)
      this.property.push(temp_array)
      }
    });
    
    this.tableSchema.items = this.property;
    console.log("main",this.tableSchema)
  }

}
