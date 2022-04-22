import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from "json-schema";
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Observer, Subject } from 'rxjs';
import { GeneralService } from '../../services/general/general.service';
import { interval } from 'rxjs';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {
  header = 'documents'
  form2: FormGroup;
  model = {};

  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];
  schema: JSONSchema7 = {
    "type": "object",
    "title": "",
    "definitions": {},
    "properties": {},
    "required": []
  };
  schemaloaded = false;
  osid: any;
  docType;
  verify: boolean = true;
  verified: boolean = false;
  certificate: any;
  entity: any;
  isScan: boolean = false;
  property: { name: { type: string; title: string; }; fileUrl: { type: string; title: string; widget: { formlyConfig: { type: string; }; }; }; };
  width: any = "100";
  imageFile: File;
  step = 0;
  steps_length = 0;
  steps_data = [];
  doc_data: any;
  schema_property: {};
  loading: boolean = false;
  policyName: any;
  attestationOSID: any;
  mySubscription: any;
  constructor(private route: ActivatedRoute,public toastMsg: ToastMessageService, public generalService: GeneralService, private formlyJsonschema: FormlyJsonschema, public router: Router) { }

  public webcamImage: WebcamImage = null;
  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    const base64 = this.webcamImage['_imageAsDataUrl'];
    // console.log(base64)
    this.dataURItoBlob(base64).subscribe((blob: Blob) => {
      const imageBlob: Blob = blob;
      const imageName: string = this.generateName();
      this.imageFile = new File([imageBlob], imageName, {
        type: "image/jpeg"
      });
      console.log(this.imageFile)
      // this.model['fileUrl'] = imageFile;
    });
  }

  dataURItoBlob(dataURI: string): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      const byteString: string = window.atob(dataURI.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: "image/jpeg" });
      observer.next(blob);
      observer.complete();
    });
  }

  generateName(): string {
    const date: number = new Date().valueOf();
    let text: string = "";
    const possibleText: string =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(
        Math.floor(Math.random() * possibleText.length)
      );
    }
    // Replace extension according to your media type like this
    return date + "." + text + ".jpeg";
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
      if (params['type']) {
        this.docType = params['type'];
        if (this.docType === 'scan') {
          this.isScan = true;
        }
      }
      if (params['entity']) {
        this.entity = params['entity'];
      }
      if (params['id']) {
        this.osid = params['id'];
        this.createDynamicForm();
      } else {
        this.createStaticForm();
      }
    })
  }

  ngAfterViewInit() {
    this.width = this.myIdentifier.nativeElement.offsetWidth;
    // var height = this.myIdentifier.nativeElement.offsetHeight;

    console.log('Width:' + this.width);
    // console.log('Height: ' + height);
  }

  @ViewChild('myIdentifier')
  myIdentifier: ElementRef;

  createStaticForm() {
    this.policyName = "attestation-SELF"
    if (this.docType === 'scan') {
      var schema: any = {
        "name": { "title": this.generalService.translateString('NAME_OF_DOCUMENT'), "type": "string" }
      };
      this.schema['properties'] = schema;
      this.schema['properties']['name']['widget'] = {};
      this.schema['properties']['name']['widget']['formlyConfig'] = {};
      this.schema['properties']['name']['widget']['formlyConfig']['templateOptions'] = { required: true };
    } else {
      var schema: any = {
        "name": { "title": this.generalService.translateString('NAME_OF_DOCUMENT'), "type": "string" },
        "fileUrl": { "title": this.generalService.translateString('DOCUMENT'), "type": "string" },
      };

      this.schema['properties'] = schema;
      this.schema['properties']['name']['widget'] = {};
      this.schema['properties']['fileUrl']['widget'] = {};
      this.schema['properties']['name']['widget']['formlyConfig'] = {};
      this.schema['properties']['fileUrl']['widget']['formlyConfig'] = { "type": "file" };
      this.schema['properties']['name']['widget']['formlyConfig']['templateOptions'] = { required: true };
      this.schema['properties']['fileUrl']['widget']['formlyConfig']['templateOptions'] = { required: true };
    }

    this.form2 = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];
    this.schemaloaded = true;
    this.verified = true;
  }

  createDynamicForm() {
    var search = {
      "entityType": [
        "Issuer"
      ],
      "filters": {
        "osid": {
          "eq": this.osid
        }
      }
    }
    this.generalService.postData('/Issuer/search', search).subscribe((res) => {
      console.log('pub res', res);
      this.doc_data = res[0];
      this.policyName = res[0]['policyName']
      if (this.doc_data['steps'] && this.doc_data['steps'].length > 0) {
        this.steps_length = this.doc_data['steps'].length;
        this.schema_property = JSON.parse(this.doc_data['steps'][this.step]['form'])
      } else {
        this.schema_property = JSON.parse(this.doc_data['additionalInput']);
      }

      this.certificate = this.doc_data['title'];
      this.schema.properties = this.schema_property;
      this.form2 = new FormGroup({});
      this.options = {};
      this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];
      this.schemaloaded = true;
      console.log(this.schema)
      // this.documentTypes = res;
    }, (err) => {
      // this.toastMsg.error('error', err.error.params.errmsg)
      console.log('error', err)
    });
  }


  submit() {
    this.loading = true;
    if (this.steps_length > 0 && this.steps_length != this.step) {
      var api = this.doc_data['steps'][this.step]['api'];
      this.doc_data['steps'][this.step]['request'] = this.model
      this.generalService.postData(api, this.model).subscribe((res) => {
        console.log('api res', res);
        this.doc_data['steps'][this.step]['response'] = res;

        this.step++;
        console.log(this.steps_length, this.step)
        if (this.steps_length == this.step) {
          this.schemaloaded = false;
          this.schema_property = JSON.parse(this.doc_data['additionalInput'])
          for (var [key, value] of Object.entries(this.schema_property)) {
            console.log(key, value);
            if (value["value"]) {
              var datavalue = this.getValue(value["value"], this.doc_data);
              console.log("datavalue", datavalue)
              this.schema_property[key]["value"] = datavalue;
              this.schema_property[key]['widget'] = {
                "formlyConfig": {
                  "defaultValue": datavalue,
                  "templateOptions": {
                    required: true,
                    disabled: true
                  },
                  "expressionProperties": {
                  },
                  "validation": {},
                  "modelOptions": {}
                }
              }
              if (this.schema_property[key]["hidden"]) {
                this.schema_property[key]['widget']['type'] = 'input'
                this.schema_property[key]['widget']['formlyConfig']['templateOptions']['type'] = 'hidden' ;
              }
            }

          };
          this.schema.properties = this.schema_property;
          this.form2 = new FormGroup({});
          this.options = {};
          this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];
          console.log("schema", this.schema_property)
          this.schemaloaded = true;
          this.loading = false;
        }
      });

    } else {
      if (!this.osid) {
        var formData = new FormData();
        var file;
        if (this.docType === 'scan') {
          file = this.imageFile;
          formData.append("files", file);
        } else if (this.model['fileUrl'] && this.model['name']) {

          this.loading = true;


          var file = this.model['fileUrl'][0];
          let fileName = file.name.replace(/\s+/g, '');
          var blob = file.slice(0, file.size, file.type); 
          file = new File([blob], fileName , {type: file.type});
          
          formData.append("files", file);
        }
          this.generalService.getData(this.entity).subscribe((res) => {
            var url = [this.entity, res[0]['osid'], 'attestation', 'documents']
            this.generalService.postData(url.join('/'), formData).subscribe((res2) => {
              this.model['fileUrl'] = res2['documentLocations'];
              var attest = {
                "name": this.policyName,
                "entityName": "User",
                "entityId": res[0]['osid'],
                "additionalInput": this.model
              }
              console.log(attest);
              this.postData('send', attest);
            })
          })
        
      }
      else {
        this.generalService.getData(this.entity).subscribe((res) => {
          this.model['title'] = this.certificate;
          var attest = {
            "name": this.policyName,
            "entityName": "User",
            "entityId": res[0]['osid'],
            "additionalInput": this.model
          }
          console.log(attest);
          this.postData('send', attest);
        });
      }
    }

  }

  getValue(value, steps) {
    var data = value.split('.');
    var result;
    data.forEach(element => {
      var num = this.isNumeric(element)
      if (num) {
        try {
          element = parseInt(element)
        }
        catch (err) {
          element = element
        }

      }
      steps = steps[element]
    });

    return steps;
  }

  isNumeric(_input) {
    return /\d/.test(_input);
  }


  postData(url, data) {
    if(this.doc_data && this.doc_data['logoUrl']){
      data['logoUrl'] = this.doc_data['logoUrl']
    }
    this.generalService.postData(url, data).subscribe((res) => {
      console.log('post res', res);
      this.attestationOSID = res.result.attestationOSID;
      // interval(5000).subscribe((x =>{
      //   this.getPublishedData()
      // }, 5000));

      this.mySubscription=interval(5000).subscribe(x => {
        console.log("xxx",x)
        if(x==12){
          this.router.navigate([this.entity, 'documents'])
          this.toastMsg.error('error', "Taking more time than usual to fetch document from issuer, something went wrong, please try again")
          this.mySubscription.unsubscribe()
        }
        this.getPublishedData()
    });
      // this.router.navigate([this.entity, 'documents'])
      // this.documentTypes = res;
    }, (err) => {
      this.router.navigate([this.entity, 'documents'])

      // this.toastMsg.error('error', err.error.params.errmsg)
      console.log('error', err)
    });
  }

  getPublishedData(){
    this.generalService.getData(this.entity).subscribe((res) => {
      console.log('getPublishedData', res,this.policyName,this.attestationOSID)
      var document = res[0][this.policyName].filter(doc => {
        return doc.osid === this.attestationOSID
      })
      console.log("document", document);
      if(document[0]._osState == "PUBLISHED"){
        this.mySubscription.unsubscribe()
        this.router.navigate([this.entity, 'documents'])
      }
    });
  }

  verifyFn() {
    this.verified = true;
    this.verify = false;
    // this.router.navigate(['documents'])
  }

}
