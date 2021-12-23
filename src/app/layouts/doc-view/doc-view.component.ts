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
    constructor(private route: ActivatedRoute,
        private keycloakService: KeycloakService, private config: AppConfig) {
        this.token = this.keycloakService.getToken();

    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(async params => {
            this.docUrl = this.baseUrl + '/' + params.u;
            this.extension = params.u.split('.').slice(-1)[0];
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

        this.route.queryParams.subscribe(async params => {
            this.extension = params.u.split('.').slice(-1)[0];
        })
    }

    async transform(src: string): Promise<any> {
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


