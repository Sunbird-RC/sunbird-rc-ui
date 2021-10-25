import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from "json-schema";
import { GeneralService } from '../services/general/general.service';
import { of as observableOf } from 'rxjs';

@Component({
  selector: 'app-issue-certificate',
  templateUrl: './issue-certificate.component.html',
  styleUrls: ['./issue-certificate.component.scss']
})
export class IssueCertificateComponent implements OnInit {
  schema: JSONSchema7 = {
    "title": "Issue Certificate",
    "type": "object",
    "required": [
      "student",
      "course"
    ],
    "properties": {
      "student": {
        "type": "string",
        "title": "Choose Student"
      },
      "course": {
        "type": "string",
        "title": "Choose Course",
        "enum": [
          "Javascript",
          "JAVA",
          "PHP",
          "Python"
        ]
      },
      "type": {
        "type": "string",
        "title": "Certification Type",
        "enum": [
          "Attendance",
          "Merit"
        ]
      },
      "date": {
        "type": "string",
        "title": "Awarded on",
      }
    }
  };
  form2: FormGroup;
  model = {};
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];
  searchResult: any[];
  constructor(private formlyJsonschema: FormlyJsonschema, public generalService: GeneralService) { }

  ngOnInit(): void {
    this.schema.properties.student['widget'] = {
      "formlyConfig": {
      "templateOptions": {
      },
      "validation": {},
      "expressionProperties": {},
      "modelOptions": {}
    }
  }
    this.schema.properties.student['widget']['formlyConfig']['type'] = "autocomplete";
    this.schema.properties.student['widget']['formlyConfig']['templateOptions']['placeholder'] = "Student";
    this.schema.properties.student['widget']['formlyConfig']['templateOptions']['label'] = "identityDetails.fullName";
    var dataval = "{{value}}"
    this.schema.properties.student['widget']['formlyConfig']['templateOptions']['search$'] = (term) => {
      if (term || term != '') {
        var formData = {
          "filters": {
            "identityDetails.fullName": {
                "contains": term
            }
        },
        "limit": 20,
        "offset": 0
        }
        // formData.filters[field.key] = {};
        // formData.filters[field.key]["contains"] = term
        dataval = term;
        this.generalService.postData("https://ndear.xiv.in/registry/api/v1/Student/search", formData).subscribe(async (res) => {
          let items = res;
          items = items.filter(x => x['identityDetails']['fullName'].toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
          if (items) {
            this.searchResult = items;
            return observableOf(this.searchResult);
          }
        });
      }
      return observableOf(this.searchResult);
    }
    this.schema.properties.date['widget'] = {
      "formlyConfig": {
      "templateOptions": {
      }
    }
  }
    this.schema.properties.date['widget']['formlyConfig']['templateOptions']['type'] = 'date';
    this.form2 = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];
  }

  submit() {
    alert(JSON.stringify(this.model));
  }

}
