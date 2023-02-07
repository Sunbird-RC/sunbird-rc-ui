import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

import {
    Pipe,
    PipeTransform,
    OnDestroy,
    WrappedValue,
    ChangeDetectorRef
} from '@angular/core';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GeneralService } from 'src/app/services/general/general.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { AppConfig } from 'src/app/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';


@Component({
    selector: 'app-doc-view',
    templateUrl: './doc-view.component.html',
    styleUrls: ['./doc-view.component.css']
})
export class DocViewComponent implements OnInit {
    docUrl: string;
    baseUrl = this.config.getEnv('baseUrl');
    extension;
    token
    public bearerToken: string | undefined = undefined;
    id: any;
    excludedFields: any = ['osid','id', 'type','fileUrl'];
    document = [];
    constructor(private route: ActivatedRoute, public generalService: GeneralService,
        private keycloakService: KeycloakService, private config: AppConfig) {
        this.token = this.keycloakService.getToken();

    }

    ngOnInit(): void {
        this.route.params.subscribe(async params => {
            if(params.id && params.type){
                this.id = params.id;
                this.generalService.getData(params.type+'/'+params.id).subscribe((res) => {
                    console.log('pub res', res);
                    if(res.name !== 'attestation-DIVOC'){
                        for (const [key, value] of Object.entries(res['additionalInput'])) {
                            var tempObject = {}
                            if(key === 'fileUrl'){
                                this.docUrl = this.baseUrl + '/' + value;
                                this.extension = this.docUrl.split('.').slice(-1)[0];
                            }
                            if (typeof value != 'object') {
                              if (!this.excludedFields.includes(key)) {
                                tempObject['key'] = key;
                                tempObject['value'] = value;
                                tempObject['type'] = res['name'];
                                tempObject['osid'] = res['osid'];
                                if(res['logoUrl']){
                                  tempObject['logoUrl'] = res['logoUrl']
                                }
                                this.document.push(tempObject);
                              }
                            } else {
                              if (!this.excludedFields.includes(key)) {
                                tempObject['key'] = key;
                                tempObject['value'] = value[0];
                                tempObject['type'] = res['name'];
                                tempObject['osid'] = res['osid'];
                                if(res['logoUrl']){
                                  tempObject['logoUrl'] = res['logoUrl']
                                }
                                this.document.push(tempObject);
                              }
                            }
    
                            
                          }
                    }
                    
                      console.log('this.document',this.document)
                  }, (err) => {
                    // this.toastMsg.error('error', err.error.params.errmsg)
                    console.log('error', err)
                  });
                  
            }
           
        })
    }
}


// Using similarity from AsyncPipe to avoid having to pipe |secure|async in HTML.

@Pipe({
    name: 'authImage'
})
export class AuthImagePipe implements PipeTransform {
    extension;
    constructor(
        private http: HttpClient, private route: ActivatedRoute,
        private keycloakService: KeycloakService, // our service that provides us with the authorization token
    ) {

        // this.route.queryParams.subscribe(async params => {
        //     this.extension = params.u.split('.').slice(-1)[0];
        // })
    }

    async transform(src: string,extension:string): Promise<any> {
        this.extension = extension;
        const token = this.keycloakService.getToken();
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        let imageBlob = await this.http.get(src, { headers, responseType: 'blob' }).toPromise();

        if (this.extension == 'pdf') {
            imageBlob = new Blob([imageBlob], { type: 'application/' + this.extension })
        } else {
            imageBlob = new Blob([imageBlob], { type: 'image/' + this.extension })
        }

        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(imageBlob);
        });
    }

}


