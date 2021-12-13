import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { SchemaService } from '../../services/data/schema.service';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { GeneralService } from '../../services/general/general.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default

})

export class SearchComponent implements OnInit {
  header: string = null;
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
  cardFields = [];
  selectOption = {};

  activeTabIs: string;

  items = [];
  apiUrl: any;
  user: any;
  searchResult: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
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
    public translate: TranslateService
  ) { 
    this.dropdownSettings = {
      singleSelection: false,
      text: this.translate.instant("SELECT_FILTER"),
      selectAllText: this.translate.instant("SELECT_ALL"),
      unSelectAllText:this.translate.instant("UNSELECT_ALL"),
      searchPlaceholderText : this.translate.instant("SEARCH"),
      enableSearchFilter: true,
      noDataLabel: this.translate.instant("FILTER_NOT_AVAILABLE"),
      classes: "myclass custom-class"
    };
  }


  ngOnInit(): void {

   

    this.schemaService.getSearchJSON().subscribe((searchSchemas) => {
      this.searchSchemas = searchSchemas;

      let _self = this;
      Object.keys(_self.searchSchemas.searches).forEach(function (key) {
        _self.searchJson = _self.searchSchemas.searches[key];


        Object.keys(_self.searchJson).forEach(function (key1) {

          _self.filtered.push(_self.searchJson[key1]);

          if (_self.searchJson[key1].hasOwnProperty('activeTab') && _self.searchJson[key1].activeTab == 'active') {
            _self.activeTabIs = _self.searchJson[key1].tab;
            _self.apiUrl = _self.searchJson[key1].api;
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
                label: this.translate.instant(filter.title),
              }
            }


            if (filter.type == 'autocomplete') {
              fieldObj.type = 'autocomplete';
              fieldObj['templateOptions']['label'] = this.translate.instant(filter.title);
              fieldObj['templateOptions']['placeholder'] = filter.placeholder;


              fieldObj['templateOptions']['search$'] = (term) => {
                if (term || term != '') {
                  var formData = {
                    "filters": {},
                    "limit": 20,
                    "offset": 0
                  }

                  formData.filters[filter.key] = {};
                  formData.filters[filter.key]["contains"] = term;

                  this.generalService.postData(filter.api, formData).subscribe(async (res) => {
                    let items = res;
                    items = items.filter(x => x[filter.key].toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
                    if (items) {
                      this.searchResult = items;
                      return observableOf(this.searchResult);
                    }
                  });
                }

                return observableOf(this.searchResult);

              }
            }

            this.dropdownList.push({ "id": filter.key, "itemName": this.translate.instant(filter.title), "data": fieldObj });

            if (filter.default) {
              this.data[0].fieldGroup.push(fieldObj);
              this.selectedItems.push({ "id": filter.key, "itemName": this.translate.instant(filter.title) });
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

  async mapFieldsdata(res) {
    this.items = [];


    await res.forEach((item, index) => {
      this.fieldsTemp = [];

      this.cardFields.forEach((key, i) => {

        var property = key.property;
        var title = this.translate.instant(key.title);
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


        this.fieldsTemp.push({ 'title': this.translate.instant(title), "value": fieldValue });

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
