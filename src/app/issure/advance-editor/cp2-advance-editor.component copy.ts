import { Component, OnInit, Input } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { Formio } from 'formiojs';

import { editorConfig } from './advance-editor-config';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';



@Component({
  selector: 'advance-editor',
  templateUrl: './advance-editor.component.html',
  styleUrls: ['./advance-editor.component.scss']
})
export class AdvanceEditorComponent implements OnInit {
  @Input() jsonSchema;
  @ViewChild('json') jsonElement?: ElementRef;
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;

  public myForm: Object = { components: [] };
  public options = editorConfig;
  eventForm: any;
  jsonFields: any;

  constructor() {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.mode = 'code';
    this.editorOptions.history = true;
    this.editorOptions.onChange = () => this.jsonEditor.get();
  }

  ngOnInit(): void {
    this.formioJsonBuild(this.jsonSchema);
  }

  formioJsonBuild(jsonFields) {
    this.jsonFields = jsonFields;
    let jsonSchema = jsonFields.definitions.SkillCertificate.properties;

    let _self = this;
    Object.keys(jsonSchema).forEach(function (key) {
      let resultJson;
      if (jsonSchema[key].type == 'array') {
        resultJson = _self.nastedJsonSep(jsonSchema, key);
      } else {
        resultJson = _self.plainJson(jsonSchema, key);
      }

      _self.myForm['components'].push(resultJson);

    });

    this.options.disabled = jsonFields.definitions.SkillCertificate.required;
  }

  nastedJsonSep(jsonSchema, key) {
    if (jsonSchema[key].type == 'array') {
      if (jsonSchema[key].items.hasOwnProperty('properties')) {
        let containerJson = { components: [] };
        containerJson['label'] = key.charAt(0).toUpperCase() + key.slice(1);
        containerJson['input'] = true;
        containerJson['type'] = 'container';
        containerJson['key'] = key;

        let subProField = jsonSchema[key].items.properties;
        let _self = this;
        Object.keys(subProField).forEach(function (key) {

          let tempField

          if (subProField[key].type == 'array') {
            tempField = _self.nastedJsonSep(subProField, key);
          } else {
            tempField = _self.plainJson(subProField, key);
          }

          containerJson['components'].push(tempField);
          // console.log({ containerJson });
        });

        return containerJson;
      }
    }
  }

  plainJson(jsonSchema, key) {

    var tempField = {};
    tempField['key'] = key;

    if (jsonSchema[key].hasOwnProperty('type') && jsonSchema[key].type == 'string') {
      tempField['type'] = 'textfield';
      tempField['input'] = true;
      tempField['inputType'] = 'text';
    }

    if (jsonSchema[key].hasOwnProperty('title')) {
      tempField['label'] = jsonSchema[key].title;
    } else {
      tempField['label'] = key.charAt(0).toUpperCase() + key.slice(1);
    }


    if (this.jsonFields.definitions.SkillCertificate.hasOwnProperty('required') && this.jsonFields.definitions.SkillCertificate.required.includes(key)) {
      tempField['validate'] = {
        "required": true
      };
    }

    if (jsonSchema[key].hasOwnProperty('format') && jsonSchema[key].format == 'date') {
      tempField['type'] = 'datetime';
      tempField['enableDate'] = true;
      tempField['enableTime'] = false;
    }

    return tempField;
  }

  onChange(event) {

    // this.jsonElement.nativeElement.innerHTML = '';
    // this.eventForm = event.form;
    // this.jsonElement.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 4)));

    if (event.type == 'saveComponent' || event.type == "addComponent" || event.type == 'deleteComponent') {
      console.log(event.form.components);


      let tempField;
      event.form.components.forEach(element => {


        if (element.type == 'container') {
          if (element.hasOwnProperty('components') && element.components.length) {
            tempField = this.formioJsonToNastedJSONSchema(event, element);
          }
        } else {
          tempField = this.formioJsonToPlainJSONSchema(event, element);
        }


        // if (element.type == 'container') {
        //   tempField[element.key]['format'] = 'date'
        //   if(element.hasOwnProperty('components') && element.components.length)
        //   {
        //     this.formioJsonToNastedJSONSchema(event, element);
        //   }
        // }

        // "skills": {
        //   "type": "array",
        //   "items": {
        //     "type": "object",
        //     "properties": {
        //       "skill": {
        //         "type": "string"
        //       },
        //       "certifiedOn": {
        //         "type": "string"
        //       }
        //     }
        //   }
        // }

      


        // if (this.jsonFields.definitions.SkillCertificate.hasOwnProperty('required') && this.jsonFields.definitions.SkillCertificate.required.includes(key)) {
        //   tempField['validate'] = {
        //     "required": true
        //   };
        // }

        this.jsonFields.definitions.SkillCertificate.properties = tempField;


      });

      this.jsonEditor.set(this.jsonFields);

    }


    // if (this.properties) {
    //   let temp;
    //   let _self = this;
    //   Object.keys(this.properties).forEach(function (key) {
    //     temp = _self.properties[key];

    //     //   console.log(temp);
    //   });
    // }
  }

  formioJsonToNastedJSONSchema(event, element) {
    let tempField = {};

    if (event.type == "addComponent" && event.component.key == element.key) {
      let temp = element.label.replaceAll(/\s/g, '');

      element.key = temp.charAt(0).toLowerCase() + temp.slice(1);
    }

    tempField[element.key] = {
      'type': 'string'
    };

    if (element.label) {
      tempField[element.key]['title'] = element.label
    }

    if (element.type == 'datetime') {
      tempField[element.key]['format'] = 'date'
    }

    if (element.hasOwnProperty('validate') && element.validate.required == true) {
      // this.jsonFields.definitions.SkillCertificate.required = [];
      this.jsonFields.definitions.SkillCertificate.required.push(element.key);
    }

    // if (element.type == 'container') {
    //   if (element.hasOwnProperty('components') && element.components.length) {
    //     tempField = this.formioJsonToNastedJSONSchema(event, element);
    //   }
    // } else {
    //   tempField = this.formioJsonToPlainJSONSchema(event, element);
    // }
    return tempField;
  }

  formioJsonToPlainJSONSchema(event, element) {
    let tempField = {};

    if (event.type == "addComponent" && event.component.key == element.key) {
      let temp = element.label.replaceAll(/\s/g, '');

      element.key = temp.charAt(0).toLowerCase() + temp.slice(1);
    }



    tempField[element.key] = {
      'type': 'string'
    };

    if (element.label) {
      tempField[element.key]['title'] = element.label
    }

    if (element.type == 'datetime') {
      tempField[element.key]['format'] = 'date'
    }

    if (element.hasOwnProperty('validate') && element.validate.required == true) {
      // this.jsonFields.definitions.SkillCertificate.required = [];
      this.jsonFields.definitions.SkillCertificate.required.push(element.key);
    }

    return tempField;

    console.log('tempField', tempField);

  }



  onDeleteComponent(e) {
    alert('onDeleteComponent');
  }

  onSubmit(event) { }


}
