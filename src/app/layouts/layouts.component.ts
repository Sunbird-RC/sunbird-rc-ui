import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '../services/data/schema.service';
import { GeneralService } from '../services/general/general.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash-es';
import { processUIPropertiesData } from '../utility/layout.property';

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
      localStorage.setItem('entity', this.layout);
      this.layout = this.layout.toLowerCase()
    });
    this.schemaService.getSchemas().subscribe(async (res) => {
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
        this.titleVal = res;
      } else {
        this.titleVal = title;
      }
    });
    return this.titleVal;
  }

  addData() {
    if (this.layoutSchema.hasOwnProperty('langKey')) {
      this.langKey = this.layoutSchema.langKey;
    }
    this.layoutSchema.blocks?.forEach(block => {
      block['items'] = [];
      let property = processUIPropertiesData(this.model, {
        ...this.responseData.definitions,
        ...block?.customDefinitions
      }, block);
      block.items.push(property);
      this.Data.push(block);
      this.schemaloaded = true;
      console.debug("loaded schema: ", this.Data, block);
    });
  }

  async getData() {
    var get_url;
    if (this.identifier) {
      get_url = this.apiUrl + '/' + this.identifier
    } else {
      get_url = this.apiUrl
    }
    await this.generalService.getData(get_url).subscribe((res) => {
      if (this.identifier) {
        this.model = res
      }
      else {
        this.model = res[0];
        this.identifier = res[0].osid;
      }

      this.getHeadingTitle(this.model);

      this.Data = [];
      localStorage.setItem('osid', this.identifier);
      this.addData()
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
