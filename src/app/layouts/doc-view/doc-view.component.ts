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


@Component({
  selector: 'app-doc-view',
  templateUrl: './doc-view.component.html',
  styleUrls: ['./doc-view.component.css']
})
export class DocViewComponent implements OnInit {
  docUrl: string;
  baseUrl = this.config.getEnv('baseUrl');
  extension;
  public bearerToken: string | undefined = undefined;
  constructor(private route: ActivatedRoute,
    private keycloakService: KeycloakService, private config: AppConfig) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      console.log("r",params)
      this.bearerToken = 'Bearer ' + this.keycloakService.getToken();
      this.docUrl = this.baseUrl +'/'+ params.u;
      this.extension = params.u.split('.').slice(-1);
      console.log("d",this.docUrl)
    })
    
  }

}


// Using similarity from AsyncPipe to avoid having to pipe |secure|async in HTML.
@Pipe({
  name: 'secure',
  pure: false
})
export class SecurePipe implements PipeTransform, OnDestroy {
  private _latestValue: any = null;
  private _latestReturnedValue: any = null;
  private _subscription: Subscription = null;
  private _obj: Observable<any> = null;

  private previousUrl: string;
  private _result: BehaviorSubject<any> = new BehaviorSubject(null);
  private result: Observable<any> = this._result.asObservable();
  private _internalSubscription: Subscription = null;

  constructor(
      private _ref: ChangeDetectorRef,
      public generalService: GeneralService,
      private sanitizer: DomSanitizer
  ) { }

  ngOnDestroy(): void {
      if (this._subscription) {
          this._dispose();
      }
  }

  transform(link: string): any {
      let obj = this.internalTransform(link);
      return this.asyncTrasnform(obj);
  }

  private internalTransform(link: string): Observable<any> {
      if (!link) {
          return this.result;
      }

      if (this.previousUrl !== link) {
          this.previousUrl = link;
          this._internalSubscription = this.generalService.getDocument(link).subscribe(m => {
              let sanitized = this.sanitizer.bypassSecurityTrustUrl(m);
              this._result.next(sanitized);
          });
      }

      return this.result;
  }

  private asyncTrasnform(obj: Observable<any>): any {
      if (!this._obj) {
          if (obj) {
              this._subscribe(obj);
          }
          this._latestReturnedValue = this._latestValue;
          return this._latestValue;
      }
      if (obj !== this._obj) {
          this._dispose();
          return this.asyncTrasnform(obj);
      }
      if (this._latestValue === this._latestReturnedValue) {
          return this._latestReturnedValue;
      }
      this._latestReturnedValue = this._latestValue;
      return WrappedValue.wrap(this._latestValue);
  }

  private _subscribe(obj: Observable<any>) {
      var _this = this;
      this._obj = obj;

      this._subscription = obj.subscribe({
          next: function (value) {
              return _this._updateLatestValue(obj, value);
          }, error: (e: any) => { throw e; }
      });
  }

  private _dispose() {
      this._subscription.unsubscribe();
      this._internalSubscription.unsubscribe();
      this._internalSubscription = null;
      this._latestValue = null;
      this._latestReturnedValue = null;
      this._subscription = null;
      this._obj = null;
  }

  private _updateLatestValue(async: any, value: Object) {
      if (async === this._obj) {
          this._latestValue = value;
          this._ref.markForCheck();
      }
  }
}
