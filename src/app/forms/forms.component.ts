import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '../services/data/schema.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from "json-schema";
import { GeneralService } from '../services/general/general.service';
import { Location } from '@angular/common'
import { of } from 'rxjs';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
import { of as observableOf } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})


export class FormsComponent implements OnInit {
  @Input() form;
  @Input() modal;
  @Input() identifier;
  res: any;
  formSchema;
  responseData;
  schemaloaded = false;
  schema: JSONSchema7 = {
    "type": "object",
    "title": "",
    "definitions": {},
    "properties": {}
  };
  definations = {};
  property = {};
  ordering;
  required = [];
  entityId: string;
  form2: FormGroup;
  model = {};
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];
  customFields = [];
  header = null;

  type: string;
  apiUrl: string;
  redirectTo: any;
  add: boolean;
  dependencies: any;
  privateFields = [];
  internalFields = [];
  privacyCheck: boolean = false;
  globalPrivacy;
  searchResult: any[];
  states: any[] = [];
  fileFields: any[] = [];
  propertyName: string;
  notes: any;
  langKey: string;
  headingTitle;
  enumVal;
  titleVal
  isSignupForm: boolean = false;
  constructor(private route: ActivatedRoute,
    public translate: TranslateService,
    public toastMsg: ToastMessageService, public router: Router, public schemaService: SchemaService, private formlyJsonschema: FormlyJsonschema, public generalService: GeneralService, private location: Location) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.add = this.router.url.includes('add');

      if (params['form'] != undefined) {
        this.form = params['form'].split('/', 1)[0];
        this.identifier = params['form'].split('/', 2)[1];
      }

      if (params['id'] != undefined) {
        this.identifier = params['id']
      }
      if (params['modal'] != undefined) {
        this.modal = params['modal']
      }

    });

    this.schemaService.getFormJSON().subscribe((FormSchemas) => {
      var filtered = FormSchemas.forms.filter(obj => {
        return Object.keys(obj)[0] === this.form
      })
      this.formSchema = filtered[0][this.form]

      if (this.formSchema.api) {
        this.apiUrl = this.formSchema.api;
      }

      if (this.formSchema.header) {
        this.header = this.formSchema.header
      }

      if (this.formSchema.isSignupForm) {
        this.isSignupForm = this.formSchema.isSignupForm;
      }

      if (this.formSchema.title) {
        this.headingTitle = this.translate.instant(this.formSchema.title);
      }

      if (this.formSchema.redirectTo) {
        this.redirectTo = this.formSchema.redirectTo;
      }

      if (this.formSchema.type) {
        this.type = this.formSchema.type;
      }

      if (this.formSchema.langKey) {
        this.langKey = this.formSchema.langKey;
      }

      if (this.type != 'entity') {
        this.propertyName = this.type.split(":")[1];
        this.getEntityData(this.apiUrl);
      }

      this.schemaService.getSchemas().subscribe((res) => {
        this.responseData = res;
        this.formSchema.fieldsets.forEach(fieldset => {

          if (fieldset.hasOwnProperty('privacyConfig')) {
            this.privacyCheck = true;
            this.privateFields = (this.responseData.definitions[fieldset.privacyConfig].hasOwnProperty('privateFields') ? this.responseData.definitions[fieldset.privacyConfig].privateFields : []);
            this.internalFields = (this.responseData.definitions[fieldset.privacyConfig].hasOwnProperty('internalFields') ? this.responseData.definitions[fieldset.privacyConfig].internalFields : []);
          }
          this.getData();

          this.definations[fieldset.definition] = {}
          this.definations[fieldset.definition]['type'] = "object";
          if (fieldset.title) {
            this.definations[fieldset.definition]['title'] = this.generalService.translateString(this.langKey + '.' + fieldset.title);
          }

          if (fieldset.required && fieldset.required.length > 0) {
            this.definations[fieldset.definition]['required'] = fieldset.required;
          }
          if (fieldset.dependencies) {
            this.dependencies = fieldset.dependencies;
          }

          this.definations[fieldset.definition].properties = {}
          this.property[fieldset.definition] = {}

          this.property = this.definations[fieldset.definition].properties;

          if (fieldset.formclass) {
            this.schema['widget'] = {};
            this.schema['widget']['formlyConfig'] = { fieldGroupClassName: fieldset.formclass }
          }

          if (fieldset.fields[0] === "*") {
            this.definations = this.responseData.definitions;
            this.property = this.definations[fieldset.definition].properties;
            fieldset.fields = this.property;
            this.addFields(fieldset);
          } else {
            this.addFields(fieldset);
          }

          if (fieldset.except) {
            this.removeFields(fieldset)
          }
        });

        this.ordering = this.formSchema.order;
        this.schema["type"] = "object";
        this.schema["title"] = this.formSchema.title;
        this.schema["definitions"] = this.definations;
        this.schema["properties"] = this.property;
        this.schema["required"] = this.required;
        this.schema["dependencies"] = this.dependencies;
        this.loadSchema();
      },
        (error) => {
          this.toastMsg.error('error', this.translate.instant('SOMETHING_WENT_WRONG_WITH_SCHEMA_URL'))
        });

    }, (error) => {
      this.toastMsg.error('error', 'forms.json not found in src/assets/config/ - You can refer to examples folder to create the file')
    })
  }

  loadSchema() {
    this.form2 = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];

    if (this.privacyCheck) {
      this.visilibity(this.fields);
    }

    if (this.headingTitle) {
      this.fields[0].templateOptions.label = '';
    }

    if (this.add) {
      this.model = {};
    }
    this.schemaloaded = true;
  }

  visilibity(fields) {

    if (fields[0].fieldGroup.length > 1 && fields[0].fieldGroup[0].type == "object") {

      fields[0].fieldGroup.forEach(fieldObj => {

        if (this.privateFields.length || this.internalFields.length) {

          let label = fieldObj.templateOptions.label;
          let key = fieldObj.key.replace(/^./, fieldObj.key[0].toUpperCase());

          if (this.schema.definitions[key] && this.schema.definitions[key].hasOwnProperty('description')) {
            let desc = this.checkString(fieldObj.key, this.schema.definitions[key]['description']);
            fieldObj.templateOptions.label = (label ? label : desc);
          }

          if (this.privateFields.indexOf('$.' + fieldObj.key) >= 0) {
            fieldObj.templateOptions['addonRight'] = {
              class: "private-access d-flex flex-column",
              text: this.translate.instant('ONLY_BY_CONSENT')
            }
            fieldObj.templateOptions.description = this.translate.instant('VISIBILITY_ATTRIBUTE_DEFINE');
          } else if (this.internalFields.indexOf('$.' + fieldObj.key) >= 0) {
            fieldObj.templateOptions['addonRight'] = {
              class: "internal-access d-flex flex-column",
              text: this.translate.instant('ONLY_BY_ME')
            }
            fieldObj.templateOptions.description = this.translate.instant('VISIBILITY_ATTRIBUTE_DEFINE');
          }
        } else {
          fieldObj.templateOptions['addonRight'] = {
            class: "public-access d-flex flex-column",
            text: this.translate.instant('ANYONE')
          }
          fieldObj.templateOptions.description = this.translate.instant('VISIBILITY_ATTRIBUTE_DEFINE');
        }
      });
    } else {

      if (this.privateFields.indexOf('$.' + fields[0].fieldGroup[0].key) >= 0) {
        this.globalPrivacy = 'private-access';

      } else if (this.internalFields.indexOf('$.' + fields[0].fieldGroup[0].key) >= 0) {
        this.globalPrivacy = 'internal-access';
      } else if (!this.privateFields.length && !this.internalFields.length) {
        this.globalPrivacy = 'public-access';

      }
    }


  }

  checkProperty(fieldset, field) {
    this.definations[field.children.definition] = this.responseData.definitions[field.children.definition];
    var ref_properties = {}
    var ref_required = []
    if (field.children.fields && field.children.fields.length > 0) {
      field.children.fields.forEach(reffield => {

        this.addWidget(field.children, reffield, field.name);

        if (reffield.required) {
          ref_required.push(reffield.name)
        }

        ref_properties[reffield.name] = this.responseData.definitions[field.children.definition].properties[reffield.name];
      });

      if (this.responseData.definitions[fieldset.definition].properties.hasOwnProperty(field.name)) {
        this.responseData.definitions[fieldset.definition].properties[field.name].properties = ref_properties;
      } else {
        this.responseData.definitions[fieldset.definition].properties = ref_properties;

      }
      this.definations[field.children.definition].properties = ref_properties;
      this.definations[field.children.definition].required = ref_required;
    }

  }

  nastedChild(fieldset, fieldName, res) {
    let tempArr = res;

    let temp_arr_fields = [];
    let nastedArr = [];

    for (const key in tempArr) {
      if (tempArr[key].hasOwnProperty('type') && tempArr[key].type == 'string') {
        if (tempArr[key].type == 'string') {
          temp_arr_fields.push({ 'name': key, 'type': tempArr[key].type });
        }
      } else {
        let res = this.responseData.definitions[fieldName.replace(/^./, fieldName[0].toUpperCase())].properties[key];
        if (res.hasOwnProperty('properties') || res.hasOwnProperty('$ref')) {
          this.responseData.definitions[fieldName.replace(/^./, fieldName[0].toUpperCase())].properties[key].properties = tempArr[key].properties;

          for (const key1 in tempArr[key].properties) {
            nastedArr.push({ 'name': key1, 'type': tempArr[key].properties[key1].type });
          };
          delete this.responseData.definitions[fieldName.replace(/^./, fieldName[0].toUpperCase())].properties[key]['$ref'];

          let temp2 = {
            children: {
              definition: fieldName.replace(/^./, fieldName[0].toUpperCase()) + '.properties.' + key,
              fields: nastedArr
            },
            name: key.toLowerCase()
          }

          temp_arr_fields.push(temp2);
          temp2.children.fields.forEach(reffield => {
            this.addChildWidget(reffield, fieldName, key);

          });
        } else {
          delete this.responseData.definitions[fieldName.replace(/^./, fieldName[0].toUpperCase())].properties[key];
        }
      }
    }
    let temp_field = {
      children: {
        definition: fieldName.replace(/^./, fieldName[0].toUpperCase()),
        fields: temp_arr_fields
      },
      name: fieldName
    }
    this.checkProperty(fieldset, temp_field);
  }

  addFields(fieldset) {

    if (fieldset.fields.length) {

      fieldset.fields.forEach(field => {

        if (this.responseData.definitions[fieldset.definition] && this.responseData.definitions[fieldset.definition].hasOwnProperty('properties')) {
          let res = this.responseData.definitions[fieldset.definition].properties;
          if (field.children) {
            this.checkProperty(fieldset, field);

            if (this.responseData.definitions[fieldset.definition].properties[field.name].hasOwnProperty('properties')) {
              let _self = this;
              Object.keys(_self.responseData.definitions[fieldset.definition].properties[field.name].properties).forEach(function (key) {
                if (_self.responseData.definitions[fieldset.definition].properties[field.name].properties[key].hasOwnProperty('properties')) {
                  Object.keys(_self.responseData.definitions[fieldset.definition].properties[field.name].properties[key].properties).forEach(function (key1) {

                    _self.responseData.definitions[fieldset.definition].properties[field.name].properties[key].properties[key1].title = _self.checkString(key1, _self.responseData.definitions[fieldset.definition].properties[field.name].properties[key].properties[key1].title);
                   
           
                  });


                }
                console.log(key);
              });
            }


          } else if (this.responseData.definitions[fieldset.definition].properties.hasOwnProperty(field.name) && this.responseData.definitions[fieldset.definition].properties[field.name].hasOwnProperty('properties')) {
            let res = this.responseData.definitions[fieldset.definition].properties[field.name].properties;
            this.nastedChild(fieldset, field.name, res);
          }
        }

        if (field.validation) {
          if (field.validation.hasOwnProperty('message')) {
            field.validation['message'] = this.translate.instant(field.validation.message);
          }
        }

        if (field.children) {
          if(field.children.fields)
          {
            for(let i =0; i < field.children.fields.length; i++)
            {
              if (field.children.fields[i].hasOwnProperty('validation') && field.children.fields[i].validation.hasOwnProperty('message')) {
                field.children.fields[i].validation['message'] = this.translate.instant(field.children.fields[i].validation.message);
                this.responseData.definitions[fieldset.definition].properties[field.name].properties[field.children.fields[i].name]['widget']['formlyConfig']['validation']['messages']['pattern'] = this.translate.instant(field.children.fields[i].validation.message);
              }

            }
          }
         
        }

        if (field.custom && field.element) {
          this.responseData.definitions[fieldset.definition].properties[field.name] = field.element;
          if (field.element.hasOwnProperty('title')) {
            this.responseData.definitions[fieldset.definition].properties[field.name]['title'] = this.translate.instant(field.element.title);
          }
          this.customFields.push(field.name);
        } else {
          this.addWidget(fieldset, field, '')
        }

        this.definations[fieldset.definition].properties[field.name] = this.responseData.definitions[fieldset.definition].properties[field.name];

        if (field.children && !field.children.title) {
          if (this.property[field.name].title) {
            delete this.property[field.name].title;
          }
          if (this.property[field.name].description) {
            delete this.property[field.name].description;
          }

        }
      });
    } else {
      let res = this.responseData.definitions[fieldset.definition].properties;
      this.nastedChild(fieldset, fieldset.definition, res);
    }
  }

  removeFields(fieldset) {
    fieldset.except.forEach(field => {
      delete this.definations[fieldset.definition].properties[field];
    });
  }

  addLockIcon(responseData) {
    if (responseData.access == 'private' && responseData.widget.formlyConfig.templateOptions['type'] != "hidden") {
      if (!responseData.widget.formlyConfig.templateOptions['addonRight']) {
        responseData.widget.formlyConfig.templateOptions['addonRight'] = {}
      }
      if (!responseData.widget.formlyConfig.templateOptions['attributes']) {
        responseData.widget.formlyConfig.templateOptions['attributes'] = {}
      }
      responseData.widget.formlyConfig.templateOptions['addonRight'] = {
        class: "private-access",
        text: this.translate.instant('ONLY_BY_CONSENT')

      }
      responseData.widget.formlyConfig.templateOptions['attributes'] = {
        style: "width: 100%;"
      }

    } else if (responseData.access == 'internal' && responseData.widget.formlyConfig.templateOptions['type'] != "hidden") {
      if (!responseData.widget.formlyConfig.templateOptions['addonRight']) {
        responseData.widget.formlyConfig.templateOptions['addonRight'] = {}
      }
      if (!responseData.widget.formlyConfig.templateOptions['attributes']) {
        responseData.widget.formlyConfig.templateOptions['attributes'] = {}
      }
      responseData.widget.formlyConfig.templateOptions['addonRight'] = {
        class: "internal-access",
        text: this.translate.instant('ONLY_BY_ME')

      }
      responseData.widget.formlyConfig.templateOptions['attributes'] = {
        style: "width: 100%;"
      }
    }
  }


  checkString(conStr, title) {
    this.translate.get(this.langKey + '.' + conStr).subscribe(res => {
      let constr = this.langKey + '.' + conStr;
      if (res != constr) {
        this.titleVal = res;
      } else {
        this.titleVal = title;
      }
    });
    return this.titleVal;
  }


  addWidget(fieldset, field, childrenName) {

    this.translate.get(this.langKey + '.' + field.name).subscribe(res => {
      let constr = this.langKey + '.' + field.name;
      if (res != constr) {
        this.responseData.definitions[fieldset.definition].properties[field.name].title = this.generalService.translateString(this.langKey + '.' + field.name);
      }
    })

    if (field.widget) {
      this.responseData.definitions[fieldset.definition].properties[field.name]['widget'] = field.widget;
    }
    else {
      this.res = this.responseData.definitions[fieldset.definition].properties[field.name];

      if (this.res != undefined && !this.res.hasOwnProperty('properties')) {
        this.responseData.definitions[fieldset.definition].properties[field.name]['widget'] = {
          "formlyConfig": {
            "templateOptions": {
            },
            "validation": {},
            "expressionProperties": {},
            "modelOptions": {}
          }

        }

        if (field.placeholder) {
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['placeholder'] = this.generalService.translateString(this.langKey + '.' + field.placeholder);
        }

        if (field.description) {
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['description'] = this.generalService.translateString(this.langKey + '.' + field.description);
        }

        if (field.classGroup) {
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['fieldGroupClassName'] = field.classGroup;
        }
        if (field.expressionProperties) {
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['expressionProperties'] = field.expressionProperties;
        }
        if (field.class) {
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['className'] = field.class;
        }

        if ( this.responseData.definitions[fieldset.definition].properties[field.name].hasOwnProperty('items')) {
          if(this.responseData.definitions[fieldset.definition].properties[field.name].items.hasOwnProperty('properties'))
          {
            let _self = this;
            Object.keys(_self.responseData.definitions[fieldset.definition].properties[field.name].items.properties).forEach(function (key) {
              console.log(key);
              _self.responseData.definitions[fieldset.definition].properties[field.name].items.properties[key].title = _self.checkString(key, _self.responseData.definitions[fieldset.definition].properties[field.name].items.properties[key].title);
             
            
            });

          }
        }

        if (field.hidden) {
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['type'] = "hidden";
          delete this.responseData.definitions[fieldset.definition].properties[field.name]['title']
        }
        if (field.required || field.children) {
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['required'] = field.required;
        }
        if (field.children) {
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['required'] = true;
        }
        if (field.format && field.format === 'file') {
          if (this.type && this.type.includes("property")) {
            localStorage.setItem('property', this.type.split(":")[1]);
          }
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['type'] = field.format;
          if (field.multiple) {
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['multiple'] = field.multiple;
          }
          this.fileFields.push(field.name);
        }

        if (this.privacyCheck && this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['type'] != "hidden" && (this.privateFields.indexOf('$.' + childrenName) < 0) && (this.internalFields.indexOf('$.' + childrenName) < 0)) {
          if (this.privateFields.length || this.internalFields.length) {
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions'] = {
              addonRight: {
                class: "public-access",
                text: this.translate.instant('ANYONE'),
              },
              attributes: {
                style: "width: 90%; "
              },
            }
          }
        }

        if (field.validation) {
          if (field.validation.message) {
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['validation'] = {
              "messages": {
                "pattern": field.validation.message
              }
            }
            if (field.validation.pattern) {
              this.responseData.definitions[fieldset.definition].properties[field.name]['pattern'] = field.validation.pattern;
            }
          }
          if (field.validation.lessThan || field.validation.greaterThan) {
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['modelOptions'] = {
              updateOn: 'blur'
            };
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['asyncValidators'] = {}
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['asyncValidators'][field.name] = {}
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['asyncValidators'][field.name]['expression'] = (control: FormControl) => {
              if (control.value != null) {
                if (field.type === 'date') {
                  if (this.model[field.validation.lessThan]) {
                    if ((new Date(this.model[field.validation.lessThan])).valueOf() > (new Date(control.value)).valueOf()) {
                      return of(control.value);
                    }
                    else {
                      return of(false);
                    }
                  } else if (this.model[field.validation.greaterThan]) {
                    if ((new Date(this.model[field.validation.greaterThan])).valueOf() < (new Date(control.value)).valueOf()) {
                      return of(control.value);
                    }
                    else {
                      return of(false);
                    }
                  }
                }
                else {
                  if (this.model[field.validation.lessThan]) {
                    if (this.model[field.validation.lessThan] > control.value) {
                      return of(control.value);
                    }
                    else {
                      return of(false);
                    }
                  }
                  else if (this.model[field.validation.greaterThan]) {
                    if (this.model[field.validation.greaterThan] < control.value) {
                      return of(control.value);
                    }
                    else {
                      return of(false);
                    }
                  }
                  else {
                    return of(false);
                  }
                }
              }
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve(true);
                }, 1000);
              });
            }
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['asyncValidators'][field.name]['message'] = field.validation.message;
          }
        }
      }
      if (field.autofill) {
        if (field.autofill.apiURL) {
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['modelOptions'] = {
            updateOn: 'blur'
          };
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['asyncValidators'] = {}
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['asyncValidators'][field.name] = {}
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['asyncValidators'][field.name]['expression'] = (control: FormControl) => {
            if (control.value != null) {
              if (field.autofill.method === 'GET') {
                var apiurl = field.autofill.apiURL.replace("{{value}}", control.value)
                this.generalService.getPrefillData(apiurl).subscribe((res) => {
                  if (field.autofill.fields) {
                    field.autofill.fields.forEach(element => {
                      for (var [key1, value1] of Object.entries(element)) {
                        this.createPath(this.model, key1, this.ObjectbyString(res, value1))
                        this.form2.get(key1).setValue(this.ObjectbyString(res, value1))
                      }
                    });
                  }
                  if (field.autofill.dropdowns) {
                    field.autofill.dropdowns.forEach(element => {
                      for (var [key1, value1] of Object.entries(element)) {
                        if (Array.isArray(res)) {
                          res = res[0]
                        }
                        this.schema["properties"][key1]['items']['enum'] = this.ObjectbyString(res, value1)
                      }
                    });
                  }
                });
              }
              else if (field.autofill.method === 'POST') {
                var datapath = this.findPath(field.autofill.body, "{{value}}", '')
                if (datapath) {
                  var dataobject = this.setPathValue(field.autofill.body, datapath, control.value)
                  this.generalService.postPrefillData(field.autofill.apiURL, dataobject).subscribe((res) => {
                    if (Array.isArray(res)) {
                      res = res[0]
                    }
                    if (field.autofill.fields) {
                      field.autofill.fields.forEach(element => {

                        for (var [key1, value1] of Object.entries(element)) {
                          this.createPath(this.model, key1, this.ObjectbyString(res, value1))
                          this.form2.get(key1).setValue(this.ObjectbyString(res, value1))
                        }
                      });
                    }
                    if (field.autofill.dropdowns) {
                      field.autofill.dropdowns.forEach(element => {
                        for (var [key1, value1] of Object.entries(element)) {
                          this.schema["properties"][key1]['items']['enum'] = this.ObjectbyString(res, value1)
                        }
                      });
                    }
                  });
                }
              }
            }
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve(true);
              }, 1000);
            });
          }
        }
      }
      if (field.autocomplete) {

        this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['type'] = "autocomplete";
        this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['placeholder'] = this.generalService.translateString(this.responseData.definitions[fieldset.definition].properties[field.name]['title']);
        this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['label'] = field.autocomplete.responseKey;
        var dataval = "{{value}}"
        this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['search$'] = (term) => {
          if (term || term != '') {
            var datapath = this.findPath(field.autocomplete.body, dataval, '')
            this.setPathValue(field.autocomplete.body, datapath, term)

            dataval = term;
            this.generalService.postData(field.autocomplete.apiURL, field.autocomplete.body).subscribe(async (res) => {
              let items = res;
              items = items.filter(x => x[field.autocomplete.responseKey].toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
              if (items) {
                this.searchResult = items;
                return observableOf(this.searchResult);
              }
            });
          }
          return observableOf(this.searchResult);
        }
      }
      if (field.type) {

        if (field.type === 'multiselect') {
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['type'] = field.type;
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['multiple'] = true;
          if (field.required) {
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['placeholder'] = this.translate.instant("SELECT") + ' ' + this.generalService.translateString(this.langKey + '.' + field.name) + "*";
          } else {
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['placeholder'] = this.translate.instant("SELECT") + ' ' + this.generalService.translateString(this.langKey + '.' + field.name);
          }

          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['options'] = [];
          this.responseData.definitions[fieldset.definition].properties[field.name]['items']['enum'].forEach(enumval => {
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['options'].push({ label: enumval, value: enumval })
          });
        }
        else if (field.type === 'date') {
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['type'] = 'date';
          if (field.validation && field.validation.future == false) {
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['modelOptions'] = {
              updateOn: 'blur'
            };
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['asyncValidators'] = {}
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['asyncValidators'][field.name] = {}
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['asyncValidators'][field.name]['expression'] = (control: FormControl) => {
              if (control.value != null) {
                if ((new Date(control.value)).valueOf() < Date.now()) {
                  return of(control.value);
                } else {
                  return of(false);
                }
              }
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve(true);
                }, 1000);
              });
            };
            this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['asyncValidators'][field.name]['message'] = this.translate.instant('DATE_MUST_BIGGER_TO_TODAY_DATE');
          }
        }
        else {
          this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['type'] = field.type;
        }
      }
      if (field.disabled || field.disable) {
        this.responseData.definitions[fieldset.definition].properties[field.name]['widget']['formlyConfig']['templateOptions']['disabled'] = field.disabled
      };


      if ((this.privateFields.indexOf('$.' + childrenName) < 0) || (this.internalFields.indexOf('$.' + childrenName) < 0)) {

        let temp_access_field = '$.' + childrenName + '.' + field.name;

        if (this.privateFields.includes(temp_access_field) && (this.privateFields.indexOf('$.' + childrenName) < 0)) {
          this.responseData.definitions[fieldset.definition].properties[field.name].access = 'private';
          this.addLockIcon(this.responseData.definitions[fieldset.definition].properties[field.name]);


        } else if (this.internalFields.includes(temp_access_field) && (this.internalFields.indexOf('$.' + childrenName) < 0)) {
          this.responseData.definitions[fieldset.definition].properties[field.name].access = 'internal';
          this.addLockIcon(this.responseData.definitions[fieldset.definition].properties[field.name]);
        }
      }
    }
  }

  addChildWidget(field, ParentName, childrenName) {
    this.res = this.responseData.definitions[ParentName.replace(/^./, ParentName[0].toUpperCase())].properties[childrenName];
    this.res.properties[field.name].title = this.checkString(field.name, this.res.properties[field.name].title);
    if (field.widget) {
      this.res.properties[field.name]['widget'] = field.widget;
    }
    else {

      this.res.properties[field.name]['widget'] = {
        "formlyConfig": {
          "templateOptions": {

          },
          "validation": {},
          "expressionProperties": {}
        }
      }

      if (this.privacyCheck && (this.privateFields.indexOf('$.' + ParentName) < 0) && (this.internalFields.indexOf('$.' + ParentName) < 0)) {
        if (!this.res.properties[field.name]['widget']['formlyConfig']['templateOptions']['addonRight']) {
          this.res.properties[field.name]['widget']['formlyConfig']['templateOptions']['addonRight'] = {}
        }
        if (!this.res.properties[field.name]['widget']['formlyConfig']['templateOptions']['attributes']) {
          this.res.properties[field.name]['widget']['formlyConfig']['templateOptions']['attributes'] = {}
        }
        this.res.properties[field.name]['widget']['formlyConfig']['templateOptions']['addonRight'] = {
          class: "public-access",
          text: this.translate.instant('ANYONE')
        }
        this.res.properties[field.name]['widget']['formlyConfig']['templateOptions']['attributes'] = {
          style: "width: 90%;"
        }
      }

      if (field.disabled || field.disable) {
        this.res.properties[field.name]['widget']['formlyConfig']['templateOptions']['disabled'] = field.disabled
      };

      let temp_access_field = '$.' + ParentName + '.' + childrenName + '.' + field.name;

      if ((this.privateFields.indexOf('$.' + ParentName) < 0) || (this.privateFields.indexOf('$.' + ParentName) < 0)) {

        if (this.privateFields.includes(temp_access_field)) {
          this.res.properties[field.name].access = 'private';
          this.addLockIcon(this.res.properties[field.name]);

        } else if (this.internalFields.includes(temp_access_field)) {
          this.res.properties[field.name].access = 'internal';
          this.addLockIcon(this.res.properties[field.name]);
        }
      }

      this.responseData.definitions[ParentName.replace(/^./, ParentName[0].toUpperCase())].properties[childrenName] = this.res;

    }
  };

  submit() {
    if (this.fileFields.length > 0) {
      this.fileFields.forEach(fileField => {
        if (this.model[fileField]) {
          var formData = new FormData();
          for (let i = 0; i < this.model[fileField].length; i++) {
            const file = this.model[fileField][i]
            formData.append("files", file);
          }

          if (this.type && this.type.includes("property")) {
            var property = this.type.split(":")[1];
          }
          var url = [this.apiUrl, this.identifier, property, 'documents']
          this.generalService.postData(url.join('/'), formData).subscribe((res) => {
            var documents_list: any[] = [];
            var documents_obj = {
              "fileName": "",
              "format": "file"
            }
            res.documentLocations.forEach(element => {
              documents_obj.fileName = element;
              documents_list.push(documents_obj);
            });

            this.model[fileField] = documents_list;
            if (this.type && this.type === 'entity') {

              if (this.identifier != null) {
                this.updateData()
              } else {
                this.postData()
              }
            }
            else if (this.type && this.type.includes("property")) {
              var property = this.type.split(":")[1];
              var url = [this.apiUrl, this.identifier, property];
              this.apiUrl = (url.join("/"));
              if (this.model[property]) {
                this.model = this.model[property];
              }
              if (this.model.hasOwnProperty('attest') && this.model['attest']) {
                this.apiUrl = (url.join("/")) + '?send=true';
              } else {
                this.apiUrl = (url.join("/")) + '?send=false';
              }

              this.postData()
            }
          }, (err) => {
            console.log(err);
            this.toastMsg.error('error', this.translate.instant('SOMETHING_WENT_WRONG'))
          });
        }
        else {
          if (this.type && this.type === 'entity') {

            if (this.identifier != null) {
              this.updateData()
            } else {
              this.postData()
            }
          }
          else if (this.type && this.type.includes("property")) {
            var property = this.type.split(":")[1];

            if (this.identifier != null && this.entityId != undefined) {
              var url = [this.apiUrl, this.entityId, property, this.identifier];
            } else {
              var url = [this.apiUrl, this.identifier, property];
            }

            this.apiUrl = (url.join("/"));
            if (this.model[property]) {
              this.model = this.model[property];
            }
            if (this.model.hasOwnProperty('attest') && this.model['attest']) {
              this.apiUrl = (url.join("/")) + '?send=true';
            } else {
              this.apiUrl = (url.join("/")) + '?send=false';
            }

            if (this.identifier != null && this.entityId != undefined) {
              this.updateClaims()
            } else {
              this.postData()
            }

          }
        }
      });
    }
    else {
      if (this.type && this.type === 'entity') {

        if (this.identifier != null) {
          this.updateData()
        } else {
          this.postData()
        }
      }
      else if (this.type && this.type.includes("property")) {
        var property = this.type.split(":")[1];

        if (this.identifier != null && this.entityId != undefined) {
          var url = [this.apiUrl, this.entityId, property, this.identifier];
        } else {
          var url = [this.apiUrl, this.identifier, property];
        }

        this.apiUrl = (url.join("/"));
        if (this.model[property]) {
          this.model = this.model[property];
        }
        if (this.model.hasOwnProperty('attest') && this.model['attest']) {
          this.apiUrl = (url.join("/")) + '?send=true';
        } else {
          this.apiUrl = (url.join("/")) + '?send=false';
        }


        if (this.identifier != null && this.entityId != undefined) {
          this.updateClaims()
        } else {
          this.postData()
        }

      }
    }
  }

  filtersearchResult(term: string) {
    if (term && term != '') {
      var formData = {
        "filters": {
          "instituteName": {
            "contains": term
          }
        },
        "limit": 20,
        "offset": 0
      }
      this.generalService.postData('/Institute/search', formData).subscribe(async (res) => {
        let items = res;
        items = await items.filter(x => x.instituteName.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        if (items) {
          return items;
        }
      });
    }
  }

  async getNotes(claimId) {
    await this.generalService.getData("Teacher/claims/" + claimId).subscribe((res) => {
      this.notes = res.notes;
    })
  }

  getData() {
    var get_url;
    if (this.identifier) {
      get_url = this.propertyName + '/' + this.identifier;
    } else {
      get_url = this.apiUrl
    }
    this.generalService.getData(get_url).subscribe((res) => {
      res = (res[0]) ? res[0] : res;
      if (this.propertyName && this.entityId) {
        this.getNotes(res._osClaimId);
      }

      this.model = res;
      this.identifier = res.osid;
      this.loadSchema()
    });
  }

  postData() {
    if (Array.isArray(this.model)) {
      this.model = this.model[0];
    }
    this.generalService.postData(this.apiUrl, this.model).subscribe((res) => {
      if (res.params.status == 'SUCCESSFUL') {
        this.router.navigate([this.redirectTo])
      }
      else if (res.params.errmsg != '' && res.params.status == 'UNSUCCESSFUL') {
        this.toastMsg.error('error', res.params.errmsg)
      }
    }, (err) => {
      this.toastMsg.error('error', err.error.params.errmsg)
    });

  }

  updateData() {
    this.generalService.putData(this.apiUrl, this.identifier, this.model).subscribe((res) => {
      if (res.params.status == 'SUCCESSFUL') {
        this.router.navigate([this.redirectTo])
      }
      else if (res.params.errmsg != '' && res.params.status == 'UNSUCCESSFUL') {
        this.toastMsg.error('error', res.params.errmsg)
      }
    }, (err) => {
      this.toastMsg.error('error', err.error.params.errmsg)
    });
  }

  ObjectbyString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  };

  createPath = (obj, path, value = null) => {
    path = typeof path === 'string' ? path.split('.') : path;
    let current = obj;
    while (path.length > 1) {
      const [head, ...tail] = path;
      path = tail;
      if (current[head] === undefined) {
        current[head] = {};
      }
      current = current[head];
    }
    current[path[0]] = value;
    return obj;
  };

  findPath = (obj, value, path) => {
    if (typeof obj !== 'object') {
      return false;
    }
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var t = path;
        var v = obj[key];
        var newPath = path ? path.slice() : [];
        newPath.push(key);
        if (v === value) {
          return newPath;
        } else if (typeof v !== 'object') {
          newPath = t;
        }
        var res = this.findPath(v, value, newPath);
        if (res) {
          return res;
        }
      }
    }
    return false;
  }

  setPathValue(obj, path, value) {
    var keys;
    if (typeof path === 'string') {
      keys = path.split(".");
    }
    else {
      keys = path;
    }
    const propertyName = keys.pop();
    let propertyParent = obj;
    while (keys.length > 0) {
      const key = keys.shift();
      if (!(key in propertyParent)) {
        propertyParent[key] = {};
      }
      propertyParent = propertyParent[key];
    }
    propertyParent[propertyName] = value;
    return obj;
  }

  getEntityData(apiUrl) {
    if (this.identifier !== undefined) {
      this.generalService.getData(apiUrl).subscribe((res) => {
        this.entityId = res[0].osid;
      });
    }

  }

  updateClaims() {
    this.generalService.updateclaims(this.apiUrl, this.model).subscribe((res) => {
      if (res.params.status == 'SUCCESSFUL') {
        this.router.navigate([this.redirectTo])
      }
      else if (res.params.errmsg != '' && res.params.status == 'UNSUCCESSFUL') {
        this.toastMsg.error('error', res.params.errmsg)
      }
    }, (err) => {
      this.toastMsg.error('error', err.error.params.errmsg)
    });
  }

}


