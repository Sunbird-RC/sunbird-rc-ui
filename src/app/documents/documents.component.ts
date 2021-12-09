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
  hasDocs: boolean=false;
  getStarted: boolean=false;
  entity;
  documents: any = [];
  excludedFields: any = ['osid'];
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
      console.log('pub res',res);
      this.documentTypes = res;
    }, (err) => {
      // this.toastMsg.error('error', err.error.params.errmsg)
      console.log('error', err)
    });
    this.generalService.getData(this.entity).subscribe((res) => {
      console.log('res', res)
      if(res[0]['attestation-MOSIP'] && res[0]['attestation-MOSIP'].length > 0){
        res[0]['attestation-MOSIP'].forEach(doc => {
          this.docs.push(doc)
        });
        this.hasDocs = true;
        
      }
      if(res[0]['attestation-SELF'] && res[0]['attestation-SELF'].length > 0){
        res[0]['attestation-SELF'].forEach(doc => {
          this.docs.push(doc)
        });
        this.hasDocs = true;
      }

      if(!res[0]['attestation-SELF'] && !res[0]['attestation-MOSIP']){
        this.getStarted = true;
      }
      
      this.setDocument();
      console.log("this.docs",this.documents)
    });

    
    
  }

  setDocument(){
    this.docs.forEach(element => {
      var property = [];
      for (const [key, value] of Object.entries(element['additionalInput'])) {
        var tempObject = {}
        if(!this.excludedFields.includes(key)){
          tempObject['key'] = key;
          tempObject['value'] = value;
          tempObject['type'] = element['name']
          property.push(tempObject);
        }
        
      }
      this.documents.push(property);
    });
  }

  addDoc(){
    this.hasDocs = false;
  }
}