import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from "json-schema";
import { GeneralService } from 'src/app/services/general/general.service';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
import { SchemaService } from '../../services/data/schema.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-add-records',
  templateUrl: './add-records.component.html',
  styleUrls: ['./add-records.component.scss']
})
export class AddRecordsComponent implements OnInit {
  form2: FormGroup;
  model = {};
  schemaloaded = false;

  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];
  schema: JSONSchema7 = {
    "type": "object",
    "title": "",
    "definitions": {},
    "properties": {},
    "required": []
  };
  form: string;
  formSchema: any;
  responseData: any;
  definations: any;
  property: any;
  schemaName: any;
  item: any;

  constructor(public schemaService: SchemaService,
    public toastMsg: ToastMessageService,
    public router: Router,
    private route: ActivatedRoute,
    private formlyJsonschema: FormlyJsonschema,
    public generalService: GeneralService,
    public http: HttpClient) { 
      this.schemaName = this.route.snapshot.paramMap.get('document'); 

    }

  ngOnInit(): void {

    

      this.schemaService.getSchemas().subscribe((res) => {
        this.responseData = res;

          this.definations = this.responseData.definitions;
          this.property = this.definations[this.schemaName].properties;


          this.schema["type"] = "object";
        //  this.schema["title"] = this.formSchema.title;
          this.schema["definitions"] = this.definations;
          this.schema["properties"] = this.property;
          this.loadSchema();
        
      });

   
  }

  loadSchema() {
    this.form2 = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];

    this.fields[0].fieldGroup.forEach( (fieldObj, index) => {
      console.log({fieldObj});
      let str : any = fieldObj.key;
      if(str !== "trainingTitle")
      {
        this.fields[0].fieldGroup[index].templateOptions['label'] = str.charAt(0).toUpperCase() + str.slice(1);

      }else{
        this.fields[0].fieldGroup[index].templateOptions['label'] = 'Training Title';

      }

     // this.fields[0].fieldGroup[0]['label'] = (fieldObj.name).toUpperCase();
      
    });

    this.schemaloaded = true;
  }

  submit()
  {
    console.log(this.model);
    this.generalService.postData('/' + this.schemaName, this.model).subscribe((res)=>{

      this.router.navigate(['records/' + this.schemaName]);


    })
  }

}
