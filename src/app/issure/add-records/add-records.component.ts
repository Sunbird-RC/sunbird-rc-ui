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
  headerName: string = 'records'

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
  fieldKey: any;

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
      this.schema["required"] = this.definations[this.schemaName].required;

      this.loadSchema();

    });


  }

  loadSchema() {
    this.form2 = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];

    this.fields[0].fieldGroup.forEach((fieldObj, index) => {
      console.log({ fieldObj });

      if (fieldObj.hasOwnProperty('type') && fieldObj.type) {
        fieldObj.templateOptions['type'] = fieldObj.type;
        fieldObj.type = 'string';
      }

      this.fieldKey = fieldObj.key;

      if (!fieldObj.templateOptions.hasOwnProperty('label') || fieldObj.templateOptions.label == undefined) {
        // let str: any = (fieldObj.templateOptions.label) ? fieldObj.templateOptions.label : fieldObj.key;


        let str: any = fieldObj.key;

        if (str !== "trainingTitle") {
          this.fields[0].fieldGroup[index].templateOptions['label'] = str.charAt(0).toUpperCase() + str.slice(1);

        } else {
          this.fields[0].fieldGroup[index].templateOptions['label'] = 'Training Title';
        }

        if (this.schema.required.includes(str)) {
          this.fields[0].fieldGroup[index]['templateOptions']['required'] = true;

        }

      } else {

        if (fieldObj.templateOptions.label == undefined) {
          let str: any = fieldObj.key;

          if (str !== "trainingTitle") {
            this.fields[0].fieldGroup[index].templateOptions['label'] = str.charAt(0).toUpperCase() + str.slice(1);

          } else {
            this.fields[0].fieldGroup[index].templateOptions['label'] = 'Training Title';

          }

          if (this.schema.required.includes(str)) {
            this.fields[0].fieldGroup[index]['templateOptions']['required'] = true;

          }
        }

      }

      if (fieldObj.templateOptions['type'] == 'enum' || fieldObj.templateOptions.hasOwnProperty('options') ) {
        this.fields[0].fieldGroup[index].type = 'select';
        this.fields[0].fieldGroup[index]['templateOptions']['options'] = fieldObj.templateOptions.options;
      }

      if(this.property[this.fieldKey].hasOwnProperty('format'))
      {
        this.fields[0].fieldGroup[index]['templateOptions']['type'] = this.property[this.fieldKey].format;
      }

      if(this.property[this.fieldKey].hasOwnProperty('placeholder'))
      {
        this.fields[0].fieldGroup[index]['templateOptions']['placeholder'] = this.property[this.fieldKey].placeholder;
      }

      // this.fields[0].fieldGroup[0]['label'] = (fieldObj.name).toUpperCase();

    });

    this.schemaloaded = true;
  }

  submit() {
    console.log(this.model);
    this.generalService.postData('/' + this.schemaName, this.model).subscribe((res) => {

      this.router.navigate(['records/' + this.schemaName]);


    })
  }

}
