import { Component, OnInit, Input } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { Formio } from 'formiojs';

import { editorConfig } from './advance-editor-config';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

import { Output, EventEmitter } from '@angular/core';


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
  @Output() newItemEvent = new EventEmitter<any>();

  public myForm: Object = { components: [] };
  public options = editorConfig;
  eventForm: any;
  jsonFields: any;
  jsonTitle: any;

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
   // this.jsonCrtTTitle = jsonFields.title;
    let jsonSchema = jsonFields.definitions[this.jsonTitle].properties;

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

          let tempField = _self.plainJson(subProField, key);

          if (subProField[key].type == 'array') {
            tempField = _self.nastedJsonSep(subProField, key);
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
      this.jsonFields.definitions.SkillCertificate.required = [];

     let tempField = this.formioJsonToPlainJSONSchema(event,  event.form.components);
      

      this.jsonFields.definitions.SkillCertificate.properties = tempField;
      this.jsonEditor.set(this.jsonFields);
      this.newItemEvent.emit( this.jsonEditor);

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

  formioJsonToPlainJSONSchema(event, components) {
     let tempField = {};        

      components.forEach(element => {

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

        if (element.hasOwnProperty('placeholder')) {
          tempField[element.key]['placeholder'] = element.placeholder
        }

        if (element.hasOwnProperty('description')) {
          tempField[element.key]['description'] = element.description
        }


        if (element.type == 'datetime') {
          tempField[element.key]['format'] = 'date'
        }

        if (element.hasOwnProperty('validate') && element.validate.required == true) {
          this.jsonFields.definitions.SkillCertificate.required.push(element.key);
        }

        console.log('tempField', tempField);

        if (element.type == 'container') {
          let tempField1 = { 
            "type": "array",
            "title" : element.label,
            "items": {
              "type": "object",
              "properties": {}
            }
          }
          if (element.hasOwnProperty('components') && element.components.length) {
            tempField1.items.properties =  this.formioJsonToPlainJSONSchema(event, element.components);
            tempField[element.key] =  tempField1;
          }
        }


      });

      return tempField;
  }

  onDeleteComponent(e) {
    alert('onDeleteComponent');
  }

  onSubmit(event) { }


}
