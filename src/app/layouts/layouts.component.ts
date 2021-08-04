import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '../services/data/schema.service';
// import * as LayoutSchemas from './layouts.json'
import { GeneralService } from '../services/general/general.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormsComponent } from '../forms/forms.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit {
  @Input() layout;
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

  constructor(private route: ActivatedRoute, public schemaService: SchemaService, public generalService: GeneralService, private modalService: NgbModal,
    public router: Router) { }

  ngOnInit(): void {
    console.log("in layout----",this.layout, this.identifier, this.public)
    // this.identifier = '1-ad91e30d-9ad9-4172-ba27-3fd805ad8a75'
    // this.identifier = localStorage.getItem('entity-osid')
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.params.subscribe(params => {
      
      if (params['layout'] != undefined) {
        this.layout = params['layout']
      }
      if (params['claim']) {
        this.claim = params['claim']
      };
      if (params['tab']) {
        this.tab = params['tab']
      }
      this.layout = this.layout.toLowerCase()
    });
    this.schemaService.getSchemas().subscribe(async (res) => {
      this.responseData = res;
      console.log("this.responseData",this.layout, this.responseData);
      this.schemaService.getLayoutJSON().subscribe(async (LayoutSchemas) => {
        var filtered = LayoutSchemas.layouts.filter(obj => {
          // console.log(Object.keys(obj)[0])
          return Object.keys(obj)[0] === this.layout
        })
        console.log(filtered)
        this.layoutSchema = filtered[0][this.layout]
        if(this.layoutSchema.table){
          var url = [this.layout,'attestation',this.layoutSchema.table]
          this.router.navigate([url.join('/')])
        }
        if(this.layoutSchema.api){
          this.apiUrl = this.layoutSchema.api;
          await this.getData();
        }
      })
    })
  }

  addData() {
    this.layoutSchema.blocks.forEach(block => {
      this.property = []
      block['items'] = [];
      var temp_object;
      if (block.fields.includes && block.fields.includes.length > 0) {
        if (block.fields.includes == "*") {
          console.log("this.model", this.model)
          for (var element in this.model) {
            console.log("1", element, Array.isArray(this.model[element]))
            if (!Array.isArray(this.model[element])) {
              if(typeof this.model[element] == 'string'){
                temp_object = this.responseData['definitions'][block.definition]['properties'][element]
                      if (temp_object != undefined) {
                        temp_object['value'] = this.model[element]
                        // console.log("here", temp_object[key])
                        this.property.push(temp_object)
                      }
              }
              else{
                for (const [key, value] of Object.entries(this.model[element])) {
                  console.log("3",this.model[element],key, value)
                  if (this.responseData['definitions'][block.definition]['properties'][element]) {
                    if ('$ref' in this.responseData['definitions'][block.definition]['properties'][element]) {
                      var ref_defination = (this.responseData['definitions'][block.definition]['properties'][element]['$ref']).split('/').pop()
                      temp_object = this.responseData['definitions'][ref_defination]['properties'][key]
  
                      // this.property[key] = this.responseData['definitions'][ref_defination]['properties'][key]
                      if (temp_object != undefined) {
                        temp_object['value'] = value
                        // console.log("here", temp_object[key])
                        this.property.push(temp_object)
                      }
  
  
                    }
                    else {
                      console.log("9",this.responseData['definitions'][block.definition]['properties'][element],value)
                      if(this.responseData['definitions'][block.definition]['properties'][element]['properties'] != undefined) {
                        temp_object = this.responseData['definitions'][block.definition]['properties'][element]['properties'][key]
                        if (temp_object != undefined) {
                          temp_object['value'] = value
                          // console.log("here", temp_object[key])
                          this.property.push(temp_object)
                        }
                      }
                      else{
                        temp_object = this.responseData['definitions'][block.definition]['properties'][element]
                        if (temp_object != undefined) {
                          temp_object['value'] = this.model[element]
                          // console.log("here", temp_object[key])
                          this.property.push(temp_object)
                        }
                      }
                     
  
                      // this.property[key] = this.responseData['definitions'][block.definition]['properties'][element];
                      
  
                    }
                  }
                }
              }
              
            }
            else {
              if (block.fields.excludes && block.fields.excludes.length > 0 && !block.fields.excludes.includes(element)) {
                this.model[element].forEach(objects => {
                  console.log("2", objects)
                  for (const [key, value] of Object.entries(objects)) {
                    if(this.responseData['definitions'][block.definition]['properties'][element]){
                      if ('$ref' in this.responseData['definitions'][block.definition]['properties'][element]) {
                        var ref_defination = (this.responseData['definitions'][block.definition]['properties'][element]['$ref']).split('/').pop()
                        temp_object = this.responseData['definitions'][ref_defination]['properties'][key]
  
                        // this.property[key] = this.responseData['definitions'][ref_defination]['properties'][key]
                        if (temp_object != undefined) {
                          temp_object['value'] = value
                          // console.log("here", temp_object[key])
                          this.property.push(temp_object)
                        }
                      }
                      else {
                        // console.log("eeeeee",element)
                        temp_object = this.responseData['definitions'][block.definition]['properties'][element]['items']['properties'][key]
  
                        // this.property[key] = this.responseData['definitions'][block.definition]['properties'][element];
                        if (temp_object != undefined) {
                          temp_object['value'] = value
                          // console.log("here", temp_object[key])
                          this.property.push(temp_object)
                        }
  
                      }
                    }
                    // console.log((this.responseData['definitions'][block.definition]['properties'][element]['$ref']).split('/').pop())
                    // this.property[key] = value
                  }
                });
              }

            }
          }

        }
        else {
          block.fields.includes.forEach(element => {
            console.log("4",Array.isArray(this.model[element]),element)
            if (this.model[element] && !Array.isArray(this.model[element])) {
              console.log("8",this.model[element])
              for (const [key, value] of Object.entries(this.model[element])) {
                // console.log("3",this.responseData['definitions'][block.definition]['properties'],element)
                if (this.responseData['definitions'][block.definition]['properties'][element]) {
                  if ('$ref' in this.responseData['definitions'][block.definition]['properties'][element]) {
                    var ref_defination = (this.responseData['definitions'][block.definition]['properties'][element]['$ref']).split('/').pop()
                    temp_object = this.responseData['definitions'][ref_defination]['properties'][key]

                    // this.property[key] = this.responseData['definitions'][ref_defination]['properties'][key]
                    if (temp_object != undefined) {
                      if(element.osid){
                        temp_object['osid'] = element.osid
                      }
                      if(element.osid){
                        temp_object['_osState'] = element._osState;
                        // if(element.hasOwnProperty("_osClaimNotes")){
                        //   temp_object['_osClaimNotes'] = element._osClaimNotes;
                        // }
                      }
                      
                      temp_object['value'] = value
                      // console.log("here", temp_object[key])
                      this.property.push(temp_object)
                    }


                  }
                  else {
                    // console.log("eeeeee",element)
                    temp_object = this.responseData['definitions'][block.definition]['properties'][element]['properties'][key]

                    // this.property[key] = this.responseData['definitions'][block.definition]['properties'][element];
                    if (temp_object != undefined) {
                      if(element.osid){
                        temp_object['osid'] = element.osid
                      }
                      if(element.osid){
                        temp_object['_osState'] = element._osState
                      }
                      temp_object['value'] = value
                      // console.log("here", temp_object[key])
                      this.property.push(temp_object)
                    }

                  }
                }
              }
            }
            else {
              if (this.model[element]) {
                console.log("4.1",this.model[element])
                // var temp_array2 = []
                this.model[element].forEach((objects, i) => {
                  console.log("4.1.1",objects)
                  var osid;
                  var osState;
                  var temp_array = [];
                  
                  for (const [index, [key, value]] of Object.entries(Object.entries(objects))) {
                    
                    // var temp_object = {}
                    // console.log("4.1.1",key, value, index)
                    if ('$ref' in this.responseData['definitions'][block.definition]['properties'][element]) {
                      console.log("4.1.2")
                      var ref_defination = (this.responseData['definitions'][block.definition]['properties'][element]['$ref']).split('/').pop()
                      temp_object = this.responseData['definitions'][ref_defination]['properties'][key]

                      // this.property[key] = this.responseData['definitions'][ref_defination]['properties'][key]
                      if (temp_object != undefined) {
                        if(objects.osid){
                          temp_object['osid'] = objects.osid
                        }
                        if(objects.osid){
                          temp_object['_osState'] = objects._osState
                        }
                        temp_object['value'] = value
                        // console.log("here", temp_object[key])
                        temp_array.push(this.pushData(temp_object))
                      }
                    }
                    else {
                      // if(i==0){
                         // console.log("eeeeee",element)
                         temp_object = this.responseData['definitions'][block.definition]['properties'][element]['items']['properties'][key]

                      // this.property[key] = this.responseData['definitions'][block.definition]['properties'][element];
                      if (temp_object != undefined) {
                        if(objects.osid){
                          temp_object['osid'] = objects.osid
                        }
                        if(objects.osid){
                          temp_object['_osState'] = objects._osState
                        }
                        temp_object['value'] = value
                        // console.log("here", temp_object[key])
                        console.log("-4.1.2",value)
                        temp_array.push(this.pushData(temp_object))
                        
                        // temp_array.push(temp_object)
                        
                      }
                      // }
                     

                    }
                    // this.property.push(temp_array)
                    // console.log("4.1.3",temp_array)
                    // console.log((this.responseData['definitions'][block.definition]['properties'][element]['$ref']).split('/').pop())
                    // this.property[key] = value
                    // key = '';
                    // value = '';
                    
                  }
                  console.log("4.2",temp_array)
                  this.property.push(temp_array)
                  // this.property.push(temp_array)
                  // console.log("4.3",this.property)
                });
                // this.property = temp_array2
                // console.log("4.3",temp_array2)
              }
            }
          });
        }
      }
      // console.log(this.property)
      if (block.fields.excludes && block.fields.excludes.length > 0) {
        console.log("in excl", this.property)
        block.fields.excludes.forEach(element => {
          if (this.property.hasOwnProperty(element)) {
            delete this.property[element];
          }
        });
      }
      // this.removeCommonFields() 


      block.items.push(this.property)
      this.Data.push(block)
    })
    console.log("main", this.Data)
  }

  pushData(data) {
      var object ={};
      for( var key in data ){
          if(data.hasOwnProperty(key)) //ensure not adding inherited props
          object[key]=data[key];
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
      console.log("get 330",{ res });
      if(this.identifier) {
        this.model = res
      }
      else{
        this.model = res[0];
        this.identifier = res[0].osid;
      }
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
    var commonFields = ['osCreatedAt', 'osCreatedBy', 'osUpdatedAt', 'osUpdatedBy', 'osid'];
    const filteredArray = this.property.filter(function (x, i) {
      return commonFields.indexOf(x[i]) < 0;
    });
  }

  openModal() {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe(params => {
      // When router navigates on this component is takes the params
      // and opens up the detail modal
      let options: NgbModalOptions = {
        scrollable: true
      };
      this.currentDialog = this.modalService.open(FormsComponent, options);
      this.currentDialog.componentInstance.form = params.claim;
      this.currentDialog.componentInstance.modal = true;
      console.log('hse', params);

      // Go back to home page after the modal is closed
      this.currentDialog.result.then(
        result => {
          console.log('hello');
          // router.navigateByUrl(this.previousUrl);
        },
        reason => {
          // router.navigateByUrl(this.previousUrl);
        }
      );
    });
  }
  ngOnDestroy() {
    this.destroy.next();
  }

}
