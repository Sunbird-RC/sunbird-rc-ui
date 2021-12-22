import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from "json-schema";
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Observer, Subject } from 'rxjs';
import { GeneralService } from '../../services/general/general.service';

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
  constructor(private route: ActivatedRoute, public generalService: GeneralService, private formlyJsonschema: FormlyJsonschema, public router: Router) { }

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
    if (this.docType === 'scan') {
      var schema: any = {
        "name": { "title": this.generalService.translateString('NAME_OF_DOCUMENT'), "type": "string" }
      };
      this.schema['properties'] = schema;
    } else {
      var schema: any = {
        "name": { "title": this.generalService.translateString('NAME_OF_DOCUMENT'), "type": "string" },
        "fileUrl": { "title": this.generalService.translateString('DOCUMENT'), "type": "string" },
      };

      this.schema['properties'] = schema;
      this.schema['properties']['fileUrl']['widget'] = {};
      this.schema['properties']['fileUrl']['widget']['formlyConfig'] = { "type": "file" };
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
      var schema = JSON.parse(res[0]['additionalInput']);
      this.certificate = res[0]['title'];
      this.schema.properties = schema;
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
    if (!this.osid) {
      var formData = new FormData();
      var file;
      if(this.docType === 'scan'){
        file = this.imageFile;
        formData.append("files", file);
      }else{
        file = this.model['fileUrl']
        formData.append("files", file[0]);
      }
      
      this.generalService.getData(this.entity).subscribe((res) => {
        var url = [this.entity, res[0]['osid'], 'attestation', 'documents']
        this.generalService.postData(url.join('/'), formData).subscribe((res2) => {
          this.model['fileUrl'] = res2['documentLocations'];
          var attest = {
            "name": "attestation-SELF",
            "entityName": "User",
            "entityId": res[0]['osid'],
            "additionalInput": this.model
          }
          console.log(attest);
          this.postData('send',attest);
        })
      })
    }
    else {
      this.generalService.getData(this.entity).subscribe((res) => {
        console.log('res', res)
        this.model['title'] = this.certificate;
        var attest = {
          "name": "attestation-MOSIP",
          "entityName": "User",
          "entityId": res[0]['osid'],
          "additionalInput": this.model
        }
        console.log(attest);
        this.postData('send', attest);
      });
    }
  }

  postData(url, data) {
    this.generalService.postData(url, data).subscribe((res) => {
      console.log('pub res', res);
      this.router.navigate([this.entity, 'documents'])
      // this.documentTypes = res;
    }, (err) => {
      this.router.navigate([this.entity, 'documents'])

      // this.toastMsg.error('error', err.error.params.errmsg)
      console.log('error', err)
    });
  }

  verifyFn() {
    this.verified = true;
    this.verify = false;
    // this.router.navigate(['documents'])
  }

}
