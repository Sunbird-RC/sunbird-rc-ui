import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { AppConfig } from 'src/app/app.config';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'app-doc-detail-view',
  templateUrl: './doc-detail-view.component.html',
  styleUrls: ['./doc-detail-view.component.scss']
})
export class DocDetailViewComponent implements OnInit {

  docUrl: string;
  baseUrl = this.config.getEnv('baseUrl');
  extension;
  token
  public bearerToken: string | undefined = undefined;
  id: any;
  excludedFields: any = ['osid', 'id', 'type', 'otp', 'transactionId'];
  document = [];
  loader: boolean = true;
  docName: any;
  constructor(private route: ActivatedRoute, public generalService: GeneralService,
    private router: Router,
    private keycloakService: KeycloakService, private config: AppConfig) {
    this.token = this.keycloakService.getToken();
    pdfDefaultOptions.renderInteractiveForms = false;
    console.log("url",router.url);
  }

  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      
      if (params.id && params.type) {
        if(params.type != 'attestation-SELF'){
          this.router.navigate([this.router.url+'/view'])
        }
        this.id = params.id;
        this.generalService.getData(params.type + '/' + params.id).subscribe((res) => {
          console.log('pub res', res);
          
          if (res.name == 'attestation-SELF') {
            this.docName = res['additionalInput'].name;
            if (res['additionalInput']['fileUrl']) {
              res['additionalInput']['fileUrl'].forEach(doc => {
                var tempObject = {}
                console.log("element", doc)
                tempObject['name'] = doc.split('-').slice(-1)[0];
                tempObject['type'] = res['name'];
                tempObject['file'] =  this.baseUrl + '/' + doc;
                tempObject['extension'] = doc.split('.').slice(-1)[0];
                tempObject['osid'] = res['osid'];
                this.document.push(tempObject)
              });
            }
            this.loader = false;
          }
          console.log('this.document', this.document)
        }, (err) => {
          // this.toastMsg.error('error', err.error.params.errmsg)
          console.log('error', err)
        });

      }

    })
  }

}
