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
  searchSchemas;
  filtered = [];
  searchString: object; 

  fields: FormlyFieldConfig[] = [];
  data = [];

  form = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {};
  isLoading = true;
  searchJson;
  cardFields = [];
  selectOption = {};

  activeTabIs: string;

  items = [];
  apiUrl: unknown;
  user: [] | object |string;
  searchResult: unknown;
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

  page = 1;
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

      Object.keys(this.searchSchemas.searches).forEach(key => {
        this.searchJson = this.searchSchemas.searches[key];


        Object.keys(this.searchJson).forEach(key1 =>{

          this.filtered.push(this.searchJson[key1]);

          if (this.searchJson[key1].hasOwnProperty('activeTab') && this.searchJson[key1].activeTab == 'active') {
            this.activeTabIs = this.searchJson[key1].tab;
            this.apiUrl = this.searchJson[key1].api;
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

        fieldset.filters.forEach((filter) => {

          if (!this.privateFields.includes('$.' + filter.propertyPath)) {

            const fieldObj = {
              key: filter.key,
              type: 'input',
              className: 'col-sm-4',
              templateOptions: {
                label: this.translate.instant(filter.title),
              }
            }


            if (filter.type == 'autocomplete') {
              fieldObj.type = 'autocomplete';
              fieldObj['templateOptions']['label'] = this.translate.instant(filter.title);
              fieldObj['templateOptions']['placeholder'] = this.translate.instant(filter.placeholder);


              fieldObj['templateOptions']['search$'] = (term) => {
                if (term || term != '') {
                  const formData = {
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
          if (!this.privateFields.includes('$.' + fields.property)) {
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

    Object.keys(this.model).forEach(key => {
      this.filtered.forEach((fieldset, index) => {
        if (this.filtered[index].tab == this.activeTabIs) {

          fieldset.filters.forEach((filter) => {

            if (key == filter.key) {
              if (this.model[key]) {
                this.searchString = {
                  filters: {
                    [filter.propertyPath]: {
                      startsWith: this.model[key]
                    }
                  }
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
    });
  }

  async mapFieldsdata(res) {
    this.items = [];


    await res.forEach((item) => {
      this.fieldsTemp = [];

      this.cardFields.forEach((key) => {

        const property = key.property;
        const title = this.translate.instant(key.title);
        const propertySplit = property.split(".");

        let fieldValue = [];

        for (let j = 0; j < propertySplit.length; j++) {
          const a = propertySplit[j];

          if (j == 0 && item.hasOwnProperty(a)) {
            fieldValue = item[a];
          } else if (fieldValue.hasOwnProperty(a)) {

            fieldValue = fieldValue[a];

          } else if (fieldValue[0]) {
            const arryItem = []
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


  resetModel() {
    this.model = {};
    this.searchData();
  }

  resetData() {
    this.fields = [];
  }

  onItemSelect(item) {
    this.fields = [];
    this.data[0].fieldGroup.push(item.data);
    this.fields = [this.data[0]];
  }
  OnItemDeSelect(item) {
    this.fields = [];
    this.fields = this.data[0].fieldGroup.filter(function (obj) {
      return obj.key !== item.id;
    });
    this.data[0].fieldGroup = this.fields;
  }

  onSelectAll(items) {
    this.data[0].fieldGroup = [];
    for (let i = 0; i < items.length; i++) {
      this.data[0].fieldGroup.push(items[i].data);
    }
    this.fields = [this.data[0]];

  }

  onDeSelectAll(event) {
    this.data[0].fieldGroup = [];
    this.model = {};
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
