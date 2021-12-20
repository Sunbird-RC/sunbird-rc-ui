import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '../services/data/schema.service';
import { GeneralService } from '../services/general/general.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit, OnChanges {
  @Input() layout;
  @Input() publicData;

  @Input() identifier;
  @Input() public: boolean = false;
  claim: any;
  responseData;
  tab: string = 'profile';
  schemaloaded = false;
  layoutSchema;
  apiUrl: any;
  model: any;
  Data: string[] = [];
  property: any[] = [];
  currentDialog = null;
  destroy = new Subject<any>();
  isPreview: boolean = false;
  name: string;
  address: string;
  headerName: any;
  subHeadername = [];
  params: any;
  langKey;
  titleVal;
  constructor(private route: ActivatedRoute, public schemaService: SchemaService, private titleService: Title, public generalService: GeneralService, private modalService: NgbModal,
    public router: Router, public translate: TranslateService) {
     }

  ngOnChanges(): void {
    this.Data = [];
    this.ngOnInit();
  }

  ngOnInit(): void {

    this.subHeadername = [];
    if (this.publicData) {
      this.model = this.publicData;
      this.identifier = this.publicData.osid;
    }

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.params.subscribe(params => {
    this.params = params;
      if (params['layout'] != undefined) {
        this.layout = params['layout']
        this.titleService.setTitle(params['layout'].charAt(0).toUpperCase() + params['layout'].slice(1));
      }
      if (params['claim']) {
        this.claim = params['claim']
      };
      if (params['tab']) {
        this.tab = params['tab']
      }
      localStorage.setItem('entity',this.layout);
      this.layout = this.layout.toLowerCase()
    });
    this.schemaService.getSchemas().subscribe(async (res) => 
    {
      this.responseData = res;
      this.schemaService.getLayoutJSON().subscribe(async (LayoutSchemas) => {
        var filtered = LayoutSchemas.layouts.filter(obj => {
          return Object.keys(obj)[0] === this.layout;
        });
        this.layoutSchema = filtered[0][this.layout];
        if (this.layoutSchema.table) {
          var url = [this.layout, 'attestation', this.layoutSchema.table]
          this.router.navigate([url.join('/')])
        }
        if (this.layoutSchema.api) {
          this.apiUrl = this.layoutSchema.api;

          if (this.publicData) {
            this.Data = [];
            this.addData();
          } else {
            await this.getData();
          }

        }
      }, (error) => {
        //Layout Error callback
        console.error('layouts.json not found in src/assets/config/ - You can refer to examples folder to create the file')
      });
    },
    (error) => {
      //Schema Error callback
      console.error('Something went wrong with Schema URL or Path not found')
    });
  }

  check(conStr, title) {
    this.translate.get(this.langKey + '.' + conStr).subscribe(res => {
      let constr = this.langKey + '.' + conStr;
      if (res != constr) {
        this.titleVal =  res;
      }else{
        this.titleVal = title;
      }
    });
    return this.titleVal;
  }

  addData() {
    this.layoutSchema.blocks.forEach(block => {
      this.property = [];
      block['items'] = [];
      var temp_object;

      if (this.layoutSchema.hasOwnProperty('langKey')) {
        this.langKey = this.layoutSchema.langKey;
      }

      if (block.fields.includes && block.fields.includes.length > 0) {
        if (block.fields.includes == "*") {
          for (var element in this.model) {
            if (!Array.isArray(this.model[element])) {
              if (typeof this.model[element] == 'string') {
                temp_object = this.responseData['definitions'][block.definition]['properties'][element]
                if (temp_object != undefined) {
                 temp_object.title = this.check(element, temp_object.title);
                  temp_object['value'] = this.model[element];
                  this.property.push(temp_object)
                }
              }
              else {
                for (const [key, value] of Object.entries(this.model[element])) {
                  if (this.responseData['definitions'][block.definition]['properties'][element]) {
                    if ('$ref' in this.responseData['definitions'][block.definition]['properties'][element]) {
                      var ref_defination = (this.responseData['definitions'][block.definition]['properties'][element]['$ref']).split('/').pop()
                      temp_object = this.responseData['definitions'][ref_defination]['properties'][key]

                      if (temp_object != undefined && typeof value != 'object') {
                        temp_object.title = this.check(key, temp_object.title);
                        temp_object['value'] = value
                        this.property.push(temp_object)
                      }
                    }
                    else {
                      if (this.responseData['definitions'][block.definition]['properties'][element]['properties'] != undefined) {
                        temp_object = this.responseData['definitions'][block.definition]['properties'][element]['properties'][key]

                        if (temp_object != undefined && typeof value != 'object') {
                          temp_object.title = this.check(key, temp_object.title);
                          temp_object['value'] = value
                          this.property.push(temp_object)
                        }
                      }
                      else {
                        temp_object = this.responseData['definitions'][block.definition]['properties'][element]
                        if (temp_object != undefined) {
                          temp_object.title = this.check(element, temp_object.title);
                          temp_object['value'] = this.model[element]
                          this.property.push(temp_object)
                        }
                      }
                    }
                  }
                }
              }
            }
            else {
              if (block.fields.excludes && block.fields.excludes.length > 0 && !block.fields.excludes.includes(element)) {
                this.model[element].forEach(objects => {
                  for (const [key, value] of Object.entries(objects)) {
                    if (this.responseData['definitions'][block.definition]['properties'][element]) {
                      if ('$ref' in this.responseData['definitions'][block.definition]['properties'][element]) {
                        var ref_defination = (this.responseData['definitions'][block.definition]['properties'][element]['$ref']).split('/').pop()
                        temp_object = this.responseData['definitions'][ref_defination]['properties'][key]
                        if (temp_object != undefined && typeof value != 'object') {
                          temp_object.title = this.check(key, temp_object.title);
                          temp_object['value'] = value;
                          this.property.push(temp_object);
                        }
                      }
                      else {
                        temp_object = this.responseData['definitions'][block.definition]['properties'][element]['items']['properties'][key];
                        if (temp_object != undefined && typeof value != 'object') {
                          temp_object.title = this.check(key, temp_object.title);
                          temp_object['value'] = value;
                          this.property.push(temp_object);
                        }
                      }
                    }
                  }
                });
              }
            }
          }
        }
        else {
          block.fields.includes.forEach(element => {
            if (this.model[element] && !Array.isArray(this.model[element])) {
              for (const [key, value] of Object.entries(this.model[element])) {
                if (this.responseData['definitions'][block.definition]['properties'][element]) {
                  if ('$ref' in this.responseData['definitions'][block.definition]['properties'][element]) {
                    var ref_defination = (this.responseData['definitions'][block.definition]['properties'][element]['$ref']).split('/').pop()
                    temp_object = this.responseData['definitions'][ref_defination]['properties'][key]
                    if (temp_object != undefined && typeof value != 'object') {
                      if (element.osid) {
                        temp_object['osid'] = element.osid
                      }
                      if (element.osid) {
                        temp_object['_osState'] = element._osState;
                        // if(element.hasOwnProperty("_osClaimNotes")){
                        //   temp_object['_osClaimNotes'] = element._osClaimNotes;
                        // }
                      }
                      temp_object.title = this.check(key, temp_object.title);
                      temp_object['value'] = value
                      this.property.push(temp_object)
                    }


                  }
                  else {
                    temp_object = this.responseData['definitions'][block.definition]['properties'][element]['properties'][key];
                    if (temp_object != undefined && typeof value != 'object') {
                      if (element.osid) {
                        temp_object['osid'] = element.osid;
                      }
                      if (element.osid) {
                        temp_object['_osState'] = element._osState;
                      }
                      temp_object.title = this.check(key, temp_object.title);
                      temp_object['value'] = value;
                      this.property.push(temp_object);
                    }

                  }
                }
              }
            }
            else {
              if (this.model[element]) {
                this.model[element].forEach((objects, i) => {
                  var osid;
                  var osState;
                  var temp_array = [];

                  for (const [index, [key, value]] of Object.entries(Object.entries(objects))) {
                    if ('$ref' in this.responseData['definitions'][block.definition]['properties'][element]) {
                      var ref_defination = (this.responseData['definitions'][block.definition]['properties'][element]['$ref']).split('/').pop()
                      temp_object = this.responseData['definitions'][ref_defination]['properties'][key]
                      if (temp_object != undefined && typeof value != 'object') {
                        if (objects.osid) {
                          temp_object['osid'] = objects.osid;
                        }
                        if (objects.osid) {
                          temp_object['_osState'] = objects._osState;
                        }
                        temp_object.title = this.check(key, temp_object.title);
                        temp_object['value'] = value;
                        temp_array.push(this.pushData(temp_object))
                      }
                    }
                    else {
                      temp_object = this.responseData['definitions'][block.definition]['properties'][element]['items']['properties'][key];
                      
                      if(temp_object != undefined && temp_object.hasOwnProperty('title'))
                      {
                        temp_object.title =  this.check(key, temp_object.title);
                      }

                      if (temp_object != undefined && typeof value != 'object') {
                        if (objects.osid) {
                          temp_object['osid'] = objects.osid;
                        }
                        if (objects.osid) {
                          temp_object['_osState'] = objects._osState;
                        }
                        
                        temp_object.title = this.check(key, temp_object.title);
                        temp_object['value'] = value;
                        temp_array.push(this.pushData(temp_object));
                      }
                      // }


                    }
                  }
                  this.property.push(temp_array);
                });
              }
            }
          });
        }
      }
      if (block.fields.excludes && block.fields.excludes.length > 0) {
        block.fields.excludes.forEach(element => {
          if (this.property.hasOwnProperty(element)) {
            delete this.property[element];
          }
        });
      }
      block.items.push(this.property)
      this.Data.push(block)
      this.schemaloaded = true;
    });
  }

  pushData(data) {
    var object = {};
    for (var key in data) {
      if (data.hasOwnProperty(key))
        object[key] = data[key];
    }
    return object;
  }

  getData() {
    var get_url;
    if (this.identifier) {
      get_url = this.apiUrl + '/' + this.identifier
    } else {
      get_url = this.apiUrl
    }
    this.generalService.getData(get_url).subscribe((res) => {
      if (this.identifier) {
        this.model = res
      }
      else {
        this.model = res[0];
        this.identifier = res[0].osid;
      }

      this.getHeadingTitle(this.model);

      this.Data = [];
      localStorage.setItem('osid',this.identifier);
      this.addData()
    });
  }

  includeFields(fields) {
    fields.forEach(element => {
      if (typeof element == "object") {
        element.forEach(ref => {
          this.property[ref] = this.model[element][ref]
        });
      }
      else {
        this.property[element] = this.model[element]
      }
    });
  }

  removeCommonFields() {
    var commonFields = ['osCreatedAt', 'osCreatedBy', 'osUpdatedAt', 'osUpdatedBy', 'osid', 'OsUpdatedBy'];
    const filteredArray = this.property.filter(function (x, i) {
      return commonFields.indexOf(x[i]) < 0;
    });
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  openPreview() {
    this.isPreview = true;
  }

  getHeadingTitle(item) {
    if (this.layoutSchema.hasOwnProperty('headerName')) {
      var propertySplit = this.layoutSchema.headerName.split(".");

    let fieldValue = [];

    for (let j = 0; j < propertySplit.length; j++) {
      let a = propertySplit[j];

      if (j == 0 && item.hasOwnProperty(a)) {
        fieldValue = item[a];
      } else if (fieldValue.hasOwnProperty(a)) {

        fieldValue = fieldValue[a];

      } else if (fieldValue[0]) {
        let arryItem = []
        if (fieldValue.length > 0) {
          for (let i = 0; i < fieldValue.length; i++) {
            //  arryItem.push({ 'value': fieldValue[i][a], "status": fieldValue[i][key.attest] });
          }

          fieldValue = arryItem;

        } else {
          fieldValue = fieldValue[a];
        }

      } else {
        fieldValue = [];
      }
    }

    this.headerName = fieldValue;
    this.getSubHeadername(item);
    }
    
  }



 getSubHeadername(item) {

    if (this.layoutSchema.hasOwnProperty('subHeadername')) {
      var propertySplit = this.layoutSchema.subHeadername.split(",");

      let fieldValue = [];

      for (let k = 0; k < propertySplit.length; k++) {
        var propertyKSplit = propertySplit[k].split(".");

        for (let j = 0; j < propertyKSplit.length; j++) {

          let a = propertyKSplit[j];

          if (j == 0 && item.hasOwnProperty(a)) {
            fieldValue = item[a];
          } else if (fieldValue.hasOwnProperty(a)) {

            fieldValue = fieldValue[a];

          } else if (fieldValue[0]) {
            let arryItem = []
            if (fieldValue.length > 0) {

              fieldValue = arryItem;

            } else {
              fieldValue = fieldValue[a];
            }

          } else {
            fieldValue = [];
          }
        }

        fieldValue.length ? this.subHeadername.push(fieldValue) : [];
      }
    }
  }
}
