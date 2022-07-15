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
  public vcEditorOptions: JsonEditorOptions;
 @ViewChild(JsonEditorComponent) jsonEditor: JsonEditorComponent;
 @ViewChild(JsonEditorComponent) vcEditor: JsonEditorComponent;
 
  @Output() newItemEvent = new EventEmitter<any>();

  public myForm: Object = { components: [] };
  public options = editorConfig;
  eventForm: any;
  jsonFields: any;
  vcFields: any;
  jsonTitle: any;
  propertyArr: any;
  vcFieldsText: any;
  isShowLessJson = false;
  isShowLessVc = false;
isVcString = false;
  constructor() {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.history = true;
    this.editorOptions.onChange = () => this.jsonEditor.get();

    this.vcEditorOptions = new JsonEditorOptions();
    this.vcEditorOptions.mode = 'text';
    this.vcEditorOptions.history = true;
    this.vcEditorOptions.onChange = () => this.vcEditor.get();
}

showLessJson()
{
  this.isShowLessJson = !this.isShowLessJson;
}

showLessVc()
{
  this.isShowLessVc = !this.isShowLessVc;
}

  ngOnInit(): void {
    this.formioJsonBuild(this.jsonSchema);

    var coll = document.getElementsByClassName("collapsible");

    for (let i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
      }
  }

  formioJsonBuild(jsonFields) {

    if (typeof (jsonFields['_osConfig']['credentialTemplate']) == 'string') { 
      fetch(jsonFields['_osConfig']['credentialTemplate'])
      .then(response => response.text())
      .then(data => {
        this.vcFields  = data;
        console.log( data );
        this.isVcString = true;
      });

    } else {
      this.isVcString = false;
      this.vcFields = jsonFields['_osConfig']['credentialTemplate'];
    }

    delete jsonFields['_osConfig']['credentialTemplate'];
    this.jsonFields = jsonFields;
    this.jsonTitle = jsonFields['title'];
    let jsonSchema = jsonFields.definitions[this.jsonTitle].properties;

    this.propertyArr = [];
    let _self = this;
    Object.keys(jsonSchema).forEach(function (key) {
      let resultJson;
      _self.propertyArr.push(key);

      if (jsonSchema[key].type == 'array') {
        resultJson = _self.nastedJsonSep(jsonSchema, key, jsonFields.definitions[_self.jsonTitle]);
      } else if (jsonSchema[key].type == 'object') {
        resultJson = _self.objectJsonSchema(jsonSchema, key, jsonFields.definitions[_self.jsonTitle]);
      } else {
        resultJson = _self.plainJson(jsonSchema, key, jsonFields.definitions[_self.jsonTitle]);
      }

      _self.myForm['components'].push(resultJson);

    });

    for (let j = 0; j < jsonFields.definitions[this.jsonTitle].required.length; j++) {
      this.options.disabled.push(jsonFields.definitions[this.jsonTitle].required[j]);
    }

  }

  nastedJsonSep(jsonSchema, key, definationName) {
    if (jsonSchema[key].type == 'array') {
      if (jsonSchema[key].items.hasOwnProperty('properties')) {
        let containerJson = { components: [] };
        containerJson['label'] = key.charAt(0).toUpperCase() + key.slice(1);
        containerJson['input'] = true;
        containerJson['type'] = 'container';
        containerJson['key'] = key;

        let subProField = jsonSchema[key].items.properties;

        let _self = this;
        Object.keys(subProField).forEach(function (key1) {
          _self.propertyArr.push(key1);

          let tempField;

          if (subProField[key1].type == 'array') {
            tempField = _self.nastedJsonSep(subProField, key1, jsonSchema[key]);
          } else if (subProField[key1].type == 'object') {
            let tempField = _self.objectJsonSchema(subProField, key1, jsonSchema[key]);
          } else {
            tempField = _self.plainJson(subProField, key1, jsonSchema[key]);
          }
          containerJson['components'].push(tempField);
        });

        return containerJson;
      }
    }
  }

  objectJsonSchema(jsonSchema, key, definationName) {

    if (jsonSchema[key].type == 'object') {
      if (jsonSchema[key].hasOwnProperty('properties')) {
        let containerJson = { components: [] };
        containerJson['label'] = (jsonSchema[key].hasOwnProperty('properties')) ? jsonSchema[key].title : key.charAt(0).toUpperCase() + key.slice(1);
        containerJson['input'] = true;
        containerJson['type'] = 'container';
        containerJson['key'] = key;
        containerJson['required'] = jsonSchema[key].required;

        for (let j = 0; j < jsonSchema[key].required.length; j++) {
          this.options.disabled.push(jsonSchema[key].required[j]);
        }

        let subProField = jsonSchema[key].properties;

        let _self = this;
        Object.keys(subProField).forEach(function (key1) {
          _self.propertyArr.push(key1);

          let tempField;

          if (subProField[key1].type == 'array') {
            tempField = _self.nastedJsonSep(subProField, key1, jsonSchema[key]);
          } else if (subProField[key1].type == 'object') {
            let tempField = _self.objectJsonSchema(subProField, key1, jsonSchema[key]);
          } else {
            tempField = _self.plainJson(subProField, key1, jsonSchema[key]);
          }

          containerJson['components'].push(tempField);
          // console.log({ containerJson });
        });

        return containerJson;
      }
    }
  }

  plainJson(jsonSchema, key, definationName) {

    var tempField = {};
    tempField['key'] = key;
    tempField['input'] = true;

    if (jsonSchema[key].hasOwnProperty('type')) {
      if (jsonSchema[key].type == 'string') {
        tempField['type'] = 'textfield';
        tempField['inputType'] = 'text';
      } else if (jsonSchema[key].type == 'number') {
        tempField['type'] = 'number';
      }

    }

    if (jsonSchema[key].hasOwnProperty('title')) {
      tempField['label'] = jsonSchema[key].title;
    } else {
      tempField['label'] = key.charAt(0).toUpperCase() + key.slice(1);
    }


    if (definationName.hasOwnProperty('required') && definationName.required.includes(key)) {
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

    if (event.type == 'saveComponent' || event.type == "addComponent" || event.type == 'deleteComponent') {
      console.log(event.form.components);
      this.jsonFields.definitions[this.jsonTitle].required = [];

      let tempField = this.formioJsonToPlainJSONSchema(event, event.form.components, this.jsonFields.definitions[this.jsonTitle]);


      this.jsonFields.definitions[this.jsonTitle].properties = tempField;
    

      this.jsonEditor.set(this.jsonFields);
      // this.jsonEditor['_data']['_osConfig']['credentialTemplate'] = this.vcFields;
      // this.newItemEvent.emit(this.jsonEditor);

    }
  }

  showJson(event)
  {
    console.log(event);
    this.vcFields = JSON.parse(event.target.value);
    this.vcFieldsText = event.target.value;
   // this.vcEditor.set(this.vcFields);
  }

  saveAdvance()
  {
    console.log(this.vcFields);
   // console.log(this.jsonEditor['_data']);
    
    //let value = this.vcEditorOptions.onChange  = () => { this.vcEditor.getText();}
   // console.log( this.vcEditor.getText())

    this.jsonEditor['_data']['_osConfig']['credentialTemplate'] = this.vcFields;
    this.newItemEvent.emit(this.jsonEditor);
  }

  formioJsonToPlainJSONSchema(event, components, jsonDefination) {
    let tempFjson = {};

    components.forEach(element => {

      if ((event.type == "addComponent" || event.type == 'saveComponent') && !this.propertyArr.includes(element.key)) {
        let temp = element.label.replaceAll(/\s/g, '');

        element.key = temp.charAt(0).toLowerCase() + temp.slice(1);
        if(element.type == 'container')
        {
          jsonDefination.properties[element.key]= { 'type' : 'object' };
        }
      }

      if (element.type == 'container') {

        let containerType = jsonDefination.properties[element.key].type;
        if (containerType == 'object') {
          tempFjson[element.key] = this.objectTypeFieldData(event, element);
        } else {
          tempFjson[element.key] = this.arrayTypeFieldData(element);
        }

      } else {
        tempFjson[element.key] = this.signleFieldData(element);
        if (element.hasOwnProperty('validate') && element.validate.required == true) {
          this.jsonFields.definitions[this.jsonTitle].required.push(element.key);
        }
      }
    });

    return tempFjson;
  }

  objectTypeFieldData(event, jsonObj) {

    let fieldContainer = {
      "type": "object",
      "properties": {},
      "required": [],
    }

    fieldContainer['label'] = jsonObj.label;
    fieldContainer['input'] = true;

    if (jsonObj.hasOwnProperty('components') && jsonObj.components.length) {
      jsonObj.components.forEach(element => {

        if ((event.type == "addComponent" || event.type == 'saveComponent') && !this.propertyArr.includes(element.key)) {
          let temp = element.label.replaceAll(/\s/g, '');
  
          element.key = temp.charAt(0).toLowerCase() + temp.slice(1);
        
        }

        if (element.type == 'container') {
  
          let containerType = jsonObj.components[element.key].type;
          if (containerType == 'object') {
            fieldContainer.properties[element.key] = this.objectTypeFieldData(event, element);
          } else {
            fieldContainer.properties[element.key] = this.arrayTypeFieldData(element);
          }
  
  
        } else {
          fieldContainer.properties[element.key] = this.signleFieldData(element);
          if (element.hasOwnProperty('validate') && element.validate.required == true) {
            fieldContainer['required'].push(element.key);
          }
        }
      });
        }

      return fieldContainer;

  }

  arrayTypeFieldData(arrayJson) {

    let fieldContainer = {
      "type": "array",
      "title": arrayJson.label,
      "items": {
        "type": "object",
        "properties": {},
        "required": [],
      }
    }

    if (arrayJson.hasOwnProperty('components') && arrayJson.components.length) {
     arrayJson.components.forEach(element => {
      if (element.type == 'container') {

        let containerType = arrayJson.components[element.key].type;
        if (containerType == 'object') {
          fieldContainer.items.properties[element.key] = this.objectTypeFieldData(event, element);
        } else {
          fieldContainer.items.properties[element.key] = this.arrayTypeFieldData(element);
        }


      } else {
        fieldContainer.items.properties[element.key] = this.signleFieldData(element);
        if (element.hasOwnProperty('validate') && element.validate.required == true) {
          fieldContainer.items['required'].push(element.key);
        }
      }
    });
    } 

    return fieldContainer;
  }


  signleFieldData(fieldObj) {
    let tempFjson = {};

    let fType = (fieldObj.type == 'number') ? 'number' : 'string';
    tempFjson[fieldObj.key] = {
      'type': fType
    };

    if (fieldObj.label) {
      tempFjson[fieldObj.key]['title'] = fieldObj.label
    }

    if (fieldObj.hasOwnProperty('placeholder')) {
      tempFjson[fieldObj.key]['placeholder'] = fieldObj.placeholder
    }

    if (fieldObj.hasOwnProperty('description')) {
      tempFjson[fieldObj.key]['description'] = fieldObj.description
    }


    if (fieldObj.type == 'datetime') {
      tempFjson[fieldObj.key]['format'] = 'date'
    }

    return tempFjson[fieldObj.key];

  }


  onDeleteComponent(e) {
    alert('onDeleteComponent');
  }

  onSubmit(event) { }


}
