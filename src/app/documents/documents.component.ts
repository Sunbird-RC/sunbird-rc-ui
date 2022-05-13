import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../services/general/general.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  header = 'documents'
  documentTypes: any;
  docs: any = [];
  hasDocs: boolean = false;
  getStarted: boolean = false;
  entity;
  loader: boolean = true;
  documents: any = [];
  excludedFields: any = ['osid','id', 'type','otp','transactionId'];
  constructor(private route: ActivatedRoute, public generalService: GeneralService) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
      if (params['entity'] != undefined) {
        this.entity = params['entity'];
      }
    });
    var search = {
      "entityType": [
        "Issuer"
      ],
      "filters": {}
    }
    this.generalService.postData('/Issuer/search', search).subscribe((res) => {
      console.log('pub res', res);
      this.documentTypes = res;
    }, (err) => {
      // this.toastMsg.error('error', err.error.params.errmsg)
      console.log('error', err)
    });

    this.generalService.getData(this.entity).subscribe((res) => {
      console.log('res', res)
      if (res[0]['attestation-MOSIP'] && res[0]['attestation-MOSIP'].length > 0) {
        res[0]['attestation-MOSIP'].forEach(doc => {
          if(doc._osState == "PUBLISHED"){
            this.docs.push(doc)
            this.hasDocs = true;
          }
 
        });
        

      }
      if (res[0]['attestation-SELF'] && res[0]['attestation-SELF'].length > 0) {
        res[0]['attestation-SELF'].forEach(doc => {
          this.docs.push(doc);
          this.hasDocs = true;
        });
        
      }

      if (res[0]['attestation-DIVOC'] && res[0]['attestation-DIVOC'].length > 0) {
        res[0]['attestation-DIVOC'].forEach(doc => {
          this.docs.push(doc);
          this.hasDocs = true;
        });
      }

      if (res[0]['attestation-DIVOC-PDF'] && res[0]['attestation-DIVOC-PDF'].length > 0) {
        res[0]['attestation-DIVOC-PDF'].forEach(doc => {
          if(doc._osState == "PUBLISHED"){
          this.docs.push(doc);
          this.hasDocs = true;
          }
        });
      }

      if (!res[0]['attestation-SELF'] && !res[0]['attestation-MOSIP'] && res[0]['attestation-DIVOC']) {
        this.getStarted = true;
      }

      this.setDocument();
      console.log("this.docs", this.documents)
      this.loader = false;
    });



  }

  setDocument() {
    this.docs.forEach(element => {
      var property = [];
      // console.log("docs",this.docs)
      if (element.name == 'attestation-DIVOC') {
        element['additionalInput'] = JSON.parse(element['additionalInput'])['signedCredentials']['credentialSubject'];
        console.log("dfd", element['additionalInput'])
      }
      for (const [key, value] of Object.entries(element['additionalInput'])) {
        var tempObject = {}
        if (typeof value != 'object') {
          if (!this.excludedFields.includes(key)) {
            tempObject['key'] = key;
            tempObject['value'] = value;
            tempObject['type'] = element['name'];
            tempObject['osid'] = element['osid'];
            if(element['logoUrl']){
              tempObject['logoUrl'] = element['logoUrl']
            }
            property.push(tempObject);
          }
        } else {
          if (!this.excludedFields.includes(key)) {
            tempObject['key'] = key;
            tempObject['value'] = value[0];
            tempObject['type'] = element['name'];
            tempObject['osid'] = element['osid'];
            if(element['logoUrl']){
              tempObject['logoUrl'] = element['logoUrl']
            }
            property.push(tempObject);
          }
        }
      }

      this.documents.push(property);
    });
  }

  addDoc() {
    this.hasDocs = false;
  }
}
