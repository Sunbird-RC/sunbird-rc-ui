import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { SchemaService } from '../../services/data/schema.service';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { GeneralService } from '../../services/general/general.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default

})

export class SearchComponent implements OnInit {
  header: string;
  searchSchemas: any;
  filtered = [];
  searchString: any;

  fields: FormlyFieldConfig[] = [];
  data: any = [];

  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  isLoading: boolean = true;
  searchJson;
  privateTabsJson;
  cardFields = [];
  selectOption = {};

  activeTabIs: string;
  params: any;

  items = [];
  apiUrl: any;
  user: any;
  entity: string = '';
  searchResult: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {
    singleSelection: false,
    text: "Select filter",
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    enableSearchFilter: true,
    noDataLabel: 'Filter Not Available',
    classes: "myclass custom-class"
  };
  responseData;
  privateFields;
  searchFields = {
    tabs: [
      {
        fields: [
          {
          }
        ]
      }
    ]
  };

  page: number = 1;
  limit: number;
  fieldsTemp = [];

  constructor(
    public schemaService: SchemaService,
    private formlyJsonschema: FormlyJsonschema,
    public generalService: GeneralService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.params = params;
      if (params['form'] != undefined) {
        this.entity = params['form'].toLowerCase();
      }
    });


    this.schemaService.getSearchJSON().subscribe((searchSchemas) => {
      this.searchSchemas = searchSchemas;

      let _self = this;
      Object.keys(_self.searchSchemas.searches).forEach(function (key) {

        _self.searchJson = _self.searchSchemas.searches[key];


        Object.keys(_self.searchJson).forEach(function (key1) {

          if (key1 == _self.entity) {
            _self.privateTabsJson = _self.searchJson[key1].tabs;

            Object.keys(_self.privateTabsJson).forEach(function (key2) {
              _self.searchJson = _self.privateTabsJson[key2];

              Object.keys(_self.searchJson).forEach(function (key3) {
                _self.filtered.push(_self.searchJson[key3]);

                if (_self.searchJson[key3].hasOwnProperty('activeTab') && _self.searchJson[key3].activeTab == 'active') {
                  _self.activeTabIs = _self.searchJson[key3].tab;
                  _self.apiUrl = _self.searchJson[key3].api;
                }
              });
            });


          } else if (_self.entity == '') {
            _self.filtered.push(_self.searchJson[key1]);

            if (_self.searchJson[key1].hasOwnProperty('activeTab') && _self.searchJson[key1].activeTab == 'active') {
              _self.activeTabIs = _self.searchJson[key1].tab;
              _self.apiUrl = _self.searchJson[key1].api;
            }
          }
        })

      })

      if (this.searchSchemas.header) {
        this.header = this.searchSchemas.header;
        this.limit = this.searchSchemas.limit;
      }

      this.schemaService.getSchemas().subscribe((res) => {
        this.responseData = res;
        this.showFilter(this.filtered, this.activeTabIs);

      });

    });

  }


  showFilter(filtered, activeTabIs) {

    filtered.forEach((fieldset, index) => {
      if (filtered[index].tab == activeTabIs) {
        this.data.push({
          fieldGroupClassName: 'row', fieldGroup: []
        });

        if (filtered[index].hasOwnProperty('privateFields')) {
          this.privateFields = (this.responseData.definitions[filtered[index]['privateFields']].hasOwnProperty('privateFields') ? this.responseData.definitions[filtered[index]['privateFields']].privateFields : []);
        }

        fieldset.filters.forEach((filter, index1) => {

          if (this.privateFields != [] && !this.privateFields.includes('$.' + filter.propertyPath)) {

            let fieldObj = {
              key: filter.key,
              type: 'input',
              className: 'col-4',
              templateOptions: {
                label: filter.title,
              }
            }


            if (filter.autocomplete) {
              this.autoList(fieldObj, filter);
            }

            this.dropdownList.push({ "id": filter.key, "itemName": filter.title, "data": fieldObj });

            if (filter.default) {
              this.data[0].fieldGroup.push(fieldObj);
              this.selectedItems.push({ "id": filter.key, "itemName": filter.title });
            }
          }
        });


        this.fields = [this.data[0]];

        fieldset.results.fields.forEach((fields) => {
          if (this.privateFields != [] && !this.privateFields.includes('$.' + fields.property)) {
            this.cardFields.push(fields);
          }
        });

      }
    });


    this.searchData();
  }

  searchData() {
    this.isLoading = true;

    this.searchString = {
      "filters": {
      }
    }

    let _self = this;

    Object.keys(_self.model).forEach(function (key) {
      _self.filtered.forEach((fieldset, index) => {
        if (_self.filtered[index].tab == _self.activeTabIs) {

          fieldset.filters.forEach((filter) => {

            if (key == filter.key) {
              if (_self.model[key]) {
                _self.searchString.filters[filter.propertyPath] = {
                  "startsWith": _self.model[key]
                };
              }
            }
          });
        }
      });

    });


    this.generalService.postData(this.apiUrl, this.searchString).subscribe((res) => {
      this.mapFieldsdata(res);
      this.isLoading = false;
    }, (err) => {
    });
  }

  autoList(fieldObj, filter) {

    fieldObj.type = 'autocomplete';
    fieldObj['templateOptions']['label'] = filter.key;
    fieldObj['templateOptions']['placeholder'] = filter.placeholder;

    var dataval = "{{value}}"

    fieldObj['templateOptions']['search$'] = (term) => {
      if (term || term != '') {

        var datapath = this.findPath(filter.autocomplete.body, dataval, '')
        this.setPathValue(filter.autocomplete.body, datapath, term);
        dataval = term;

        this.generalService.postData(filter.autocomplete.apiURL, filter.autocomplete.body).subscribe(async (res) => {
          let items = res;
          items = items.filter(x => x[filter.key].toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > 1);
          if (items) {
            this.searchResult = items;
            console.log({ items });
            return observableOf(this.searchResult);
          }
        });
      }

      return observableOf(this.searchResult);

    }

  }

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

  async mapFieldsdata(res) {
    this.items = [];


    await res.forEach((item, index) => {
      this.fieldsTemp = [];

      this.cardFields.forEach((key, i) => {

        var property = key.property;
        var title = key.title;
        var propertySplit = property.split(".");

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
                arryItem.push({ 'value': fieldValue[i][a], "status": fieldValue[i][key.attest] });
              }
              // if ((!arryItem.some(e => e.value == fieldValue[i][a])) && arryItem[i -1 ]..indexOf("Marcos") !== -1) {

              fieldValue = arryItem;

            } else {
              fieldValue = fieldValue[a];
            }

          } else {
            fieldValue = [];
          }
        }


        this.fieldsTemp.push({ 'title': title, "value": fieldValue });

      });

      this.items.push({
        'fields': this.fieldsTemp,
        'data': item
      });

    });

  }

  submit() {
    this.page = 1;
    this.searchData();
  }


  resetModel(index) {
    this.model = {};
    this.searchData();
  }

  resetData() {
    this.fields = [];
  }

  onItemSelect(item: any) {
    this.fields = [];
    this.data[0].fieldGroup.push(item.data);
    this.fields = [this.data[0]];
  }
  OnItemDeSelect(item: any) {
    this.fields = [];
    this.fields = this.data[0].fieldGroup.filter(function (obj) {
      return obj.key !== item.id;
    });
    this.data[0].fieldGroup = this.fields;
  }

  onSelectAll(items: any) {
    this.data[0].fieldGroup = [];
    for (let i = 0; i < items.length; i++) {
      this.data[0].fieldGroup.push(items[i].data);
    }
    this.fields = [this.data[0]];

  }

  onDeSelectAll(items: any) {
    this.data[0].fieldGroup = [];
    this.model = {};
  }

  searchInstituteData(event) {
    let apiUrl;
  }



  onTabChange(event, activeTabIs) {
    this.cardFields = [];
    this.fields = [];
    this.data = [];
    this.dropdownList = [];
    this.selectedItems = [];
    this.items = [];
    this.model = {};
    this.page = 1;
    this.activeTabIs = activeTabIs;
    event.preventDefault()
    this.filtered.forEach((fieldset, index) => {
      if (this.filtered[index].tab == activeTabIs) {
        this.apiUrl = this.filtered[index].api;
      }
    });

    this.showFilter(this.filtered, activeTabIs);
  }

  showDetails(item) {
    this.user = [];
    this.user = item;
  }

  typeOf(value) {
    return typeof value;
  }


}
