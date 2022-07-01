import { Component, OnInit, Input } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { Formio } from 'formiojs';

import { editorConfig } from './advance-editor-config';



@Component({
  selector: 'advance-editor',
  templateUrl: './advance-editor.component.html',
  styleUrls: ['./advance-editor.component.scss']
})
export class AdvanceEditorComponent implements OnInit {
  @Input() jsonSchema;
  @ViewChild('json') jsonElement?: ElementRef;
  public myForm: Object = { components: [] };


  public options = editorConfig;
  /*
  public options = {
    disabled : editorConfig.disabled,
    builder: {
      basic: {
        title: '',
        noNewEdit: true,
        components: {
          password: false,
          button: false
        }
      },
      advanced: false,
      data: false,
      layout: false,
      premium: false,
     
    },
    editForm: {
      textfield: [
        {
          "key": "display",
          "ignore": false,
          "components": [
            {
              "key": "tooltip",
              "ignore": true
            },
            {
              "key": "prefix",
              "ignore": true
            },
            {
              "key": "labelPosition",
              "ignore": true
            },
            {
              "key": "labelWidth",
              "ignore": true
            },
            {
              "key": "labelMargin",
              "ignore": true
            },
            {
              "key": "row",
              "ignore": true
            },
            {
              "key": "suffix",
              "ignore": true
            },
            {
              "key": "widget.type",
              "ignore": true
            },
            {
              "key": "inputMaskPlaceholderChar",
              "ignore": true
            },
            {
              "key": "displayMask",
              "ignore": true
            },
            {
              "key": "autocomplete",
              "ignore": true
            },
            {
              "key": "uploadUrl",
              "ignore": true
            },
            {
              "key": "fileKey",
              "ignore": true
            },
            {
              "key": "inputMask",
              "ignore": true
            },
            {
              "key": "tabindex",
              "ignore": true
            },
            {
              "key": "customClass",
              "ignore": true
            },
            {
              "key": "allowMultipleMasks",
              "ignore": true
            },
            {
              "key": "hidden",
              "ignore": true
            },
            {
              "key": "hideLabel",
              "ignore": true
            },
            {
              "key": "showWordCount",
              "ignore": true
            },
            {
              "key": "showCharCount",
              "ignore": true
            },
            {
              "key": "mask",
              "ignore": true
            },
            {
              "key": "autofocus",
              "ignore": true
            },
            {
              "key": "spellcheck",
              "ignore": true
            },
            {
              "key": "disabled",
              "ignore": true
            },
            {
              "key": "tableView",
              "ignore": true
            },
            {
              "key": "modalEdit",
              "ignore": true
            }


          ]
        },
        {
          "key": "validation",
          "ignore": false,
          "components": [
            {
              "key": "validateOn",
              "ignore": true
            },
            {
              "key": "unique",
              "ignore": true
            },
            {
              "key": "validate.minLength",
              "ignore": true
            },
            {
              "key": "validate.maxLength",
              "ignore": true
            },
            {
              "key": "validate.minWords",
              "ignore": true
            },
            {
              "key": "validate.maxWords",
              "ignore": true
            },
            {
              "key": "validate.pattern",
              "ignore": true
            },
            {
              "key": "errorLabel",
              "ignore": true
            },
            {
              "key": "validate.customMessage",
              "ignore": true
            },
            {
              "key": "custom-validation-js",
              "ignore": true
            },
            {
              "key": "json-validation-json",
              "ignore": true
            },
            {
              "key": "errors",
              "ignore": true
            }
          ]
        },
        { key: 'api', ignore: true }, { key: 'data', ignore: true },
        { key: 'conditional', ignore: true }, { key: 'logic', ignore: true }, { key: 'layout', ignore: true }
      ],
      textarea: [
        { key: 'api', ignore: true }, { key: 'data', ignore: true },
        { key: 'conditional', ignore: true }, { key: 'logic', ignore: true }, { key: 'layout', ignore: true }
      ],
      number: [
        { key: 'api', ignore: true }, { key: 'data', ignore: true },
        { key: 'conditional', ignore: true }, { key: 'logic', ignore: true }, { key: 'layout', ignore: true }
      ],
      select: [
        { key: 'api', ignore: true }, { key: 'data', ignore: true },
        { key: 'conditional', ignore: true }, { key: 'logic', ignore: true }, { key: 'layout', ignore: true }
      ],
      selectboxes: [
        { key: 'api', ignore: true }, { key: 'data', ignore: true },
        { key: 'conditional', ignore: true }, { key: 'logic', ignore: true }, { key: 'layout', ignore: true }
      ],
      checkbox: [
        { key: 'api', ignore: true }, { key: 'data', ignore: true },
        { key: 'conditional', ignore: true }, { key: 'logic', ignore: true }, { key: 'layout', ignore: true }
      ],
      radio: [
        { key: 'api', ignore: true }, { key: 'data', ignore: true },
        { key: 'conditional', ignore: true }, { key: 'logic', ignore: true }, { key: 'layout', ignore: true }
      ]

    }
  }*/


  properties = {
    "name": {
      "type": "string"
    },
    "trainingTitle": {
      "type": "string"
    },
    "contact": {
      "type": "string"
    },
    "date": {
      "type": "string",
      "format": "date"
    },
    "note": {
      "type": "string"
    }
  };
  eventForm: any;
  jsonFields: any;


  constructor() {

  }

  ngOnInit(): void {


    this.myForm = {
      components: [
        {
          "type": "textfield",
          "input": true,
          "inputType": "text",
          "inputMask": "",
          "label": "First Name",
          "key": "firstName",
          "validate": {
            "required": true
          }
        },
        {
          "type": "textfield",
          "input": true,
          "inputType": "text",
          "label": "Last Name",
          "key": "lastName",
          "placeholder": "Enter your last name"
        },
        {
          "input": true,
          "label": "Submit",
          "tableView": false,
          "key": "submit",
          "size": "md",
          "leftIcon": "",
          "rightIcon": "",
          "block": false,
          "action": "submit",
          "disableOnInvalid": true,
          "theme": "primary",
          "type": "button"
        }]
    };



    this.formioJsonBuild1(this.jsonSchema);


    // this.myForm.components.push({
    //   type: 'textfield',
    //   label: 'New Field',
    //   key: 'newField',
    //   input: true
    // });
  }

  formioJsonBuild1(jsonFields) {
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

   // console.log(this.myForm);
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
          console.log({containerJson});
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

  addFields()
  {
    
  }

  formioJsonBuild(jsonFields) {

    /*
     {
          "type": "textfield",
          "input": true,
          "inputType": "text",
          "inputMask": "",
          "label": "First Name",
          "key": "firstName",
          "validate": {
            "required": true
        }
        }
        */

    let jsonSchema = jsonFields.definitions.SkillCertificate.properties;

    let _self = this;
    Object.keys(jsonSchema).forEach(function (key) {

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


      if (jsonFields.definitions.SkillCertificate.hasOwnProperty('required') && jsonFields.definitions.SkillCertificate.required.includes(key)) {
        tempField['validate'] = {
          "required": true
        };
      }

      if (jsonSchema[key].hasOwnProperty('format') && jsonSchema[key].format == 'date') {
        tempField['type'] = 'datetime';
        tempField['enableDate'] = true;
        tempField['enableTime'] = false;
      }

      if (jsonSchema[key].type == 'array') {

        if (jsonSchema[key].items.hasOwnProperty('properties')) {
          let containerJson = { components: [] };
          containerJson['label'] = key.charAt(0).toUpperCase() + key.slice(1);
          containerJson['input'] = true;
          containerJson['key'] = key;

          let subProField = jsonSchema[key].items.properties;

          //let _self = this;
          Object.keys(subProField).forEach(function (key) {
            if (subProField[key].hasOwnProperty('type') && subProField[key].type == 'string') {
              tempField['type'] = 'textfield';
              tempField['input'] = true;
              tempField['inputType'] = 'text';
            }

            if (subProField[key].hasOwnProperty('title')) {
              tempField['label'] = subProField[key].title;
            } else {
              tempField['label'] = key.charAt(0).toUpperCase() + key.slice(1);;
            }


            if (jsonFields.definitions.SkillCertificate.hasOwnProperty('required') && jsonFields.definitions.SkillCertificate.required.includes(key)) {
              tempField['validate'] = {
                "required": true
              };
            }

            if (subProField[key].hasOwnProperty('format') && subProField[key].format == 'date') {
              tempField['type'] = 'datetime';
              tempField['enableDate'] = true;
              tempField['enableTime'] = false;
            }

            containerJson['components'].push(tempField);


          });

          _self.myForm['components'].push(containerJson);

        }
      }



      _self.myForm['components'].push(tempField);

    });

    //console.log(this.myForm);
    this.options.disabled = jsonFields.definitions.SkillCertificate.required;

  }


  onChange(event) {
  //  console.log(event);

    this.jsonElement.nativeElement.innerHTML = '';
    this.eventForm = event.form;
    this.jsonElement.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 4)));


    if (this.properties) {
      let temp;
      let _self = this;
      Object.keys(this.properties).forEach(function (key) {
        temp = _self.properties[key];

     //   console.log(temp);
      });
    }
  }

  onDeleteComponent(e) {
    alert('onDeleteComponent');
  }

  onSubmit(event) { }


}
