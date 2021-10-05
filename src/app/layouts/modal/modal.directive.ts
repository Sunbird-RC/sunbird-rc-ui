import {
    Directive,
    OnChanges,
    OnDestroy,
    HostBinding,
    Input,
    isDevMode,
    HostListener
  } from '@angular/core';
  import {
    QueryParamsHandling,
    Router,
    ActivatedRoute,
    NavigationEnd,
    UrlTree
  } from '@angular/router';
  import { Subscription } from 'rxjs';
  import { LocationStrategy } from '@angular/common';
  @Directive({
    selector: '[panelEditLink]'
  })
  export class ModalRouterEditLinkDirective {
    @HostBinding('attr.target') @Input() target!: string;
    @Input() queryParams!: { [k: string]: any };
    @Input() fragment!: string;
    @Input() queryParamsHandling!: QueryParamsHandling;
    @Input() preserveFragment!: boolean;
    @Input() skipLocationChange!: boolean;
    @Input() replaceUrl!: boolean;
    @Input() state?: { [k: string]: any };
    private commands: any[] = [];
    private subscription: Subscription;
    private preserve!: boolean;
    @HostBinding() href!: string;
  
    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private locationStrategy: LocationStrategy
    ) {
      this.subscription = router.events.subscribe((s: any) => {
        // console.log('ssssssssss',s)
        if (s instanceof NavigationEnd) {
          this.updateTargetUrlAndHref();
        }
      });
    }
  
    @Input()
    set panelEditLink(commands: any[] | string) {
      if (commands != null && commands !== '') {
        this.commands = Array.isArray(commands) ? commands : [commands];
      } else {
        this.commands = [];
      }
      this.commands = [{ outlets: { claim: [ 'edit',  ...this.commands] } }];
    }
  
    @Input()
    set preserveQueryParams(value: boolean) {
      if (isDevMode() && <any>console && <any>console.warn) {
        console.warn(
          'preserveQueryParams is deprecated, use queryParamsHandling instead.'
        );
      }
      this.preserve = value;
    }
  
    ngOnChanges(changes: {}): any {
      this.updateTargetUrlAndHref();
    }
    ngOnDestroy(): any {
      this.subscription.unsubscribe();
    }
  
    @HostListener('click', [
      '$event.button',
      '$event.ctrlKey',
      '$event.metaKey',
      '$event.shiftKey'
    ])
    onClick(
      button: number,
      ctrlKey: boolean,
      metaKey: boolean,
      shiftKey: boolean
    ): boolean {
      if (button !== 0 || ctrlKey || metaKey || shiftKey) {
        return true;
      }
  
      if (typeof this.target === 'string' && this.target !== '_self') {
        return true;
      }
  
      const extras = {
        skipLocationChange: attrBoolValue(this.skipLocationChange),
        replaceUrl: attrBoolValue(this.replaceUrl),
        state: this.state
      };
      this.router.navigateByUrl(this.urlTree, extras);
      return false;
    }
  
    private updateTargetUrlAndHref(): void {
      this.href = this.locationStrategy.prepareExternalUrl(
        this.router.serializeUrl(this.urlTree)
      );
    }
  
    get urlTree(): UrlTree {
      return this.router.createUrlTree(this.commands, {
        relativeTo: this.route,
        queryParams: this.queryParams,
        fragment: this.fragment,
        preserveQueryParams: attrBoolValue(this.preserve),
        queryParamsHandling: this.queryParamsHandling,
        preserveFragment: attrBoolValue(this.preserveFragment)
      });
    }
  }
  


  @Directive({
    selector: '[panelAddLink]'
  })
  export class ModalRouterAddLinkDirective {
    @HostBinding('attr.target') @Input() target!: string;
    @Input() queryParams!: { [k: string]: any };
    @Input() fragment!: string;
    @Input() queryParamsHandling!: QueryParamsHandling;
    @Input() preserveFragment!: boolean;
    @Input() skipLocationChange!: boolean;
    @Input() replaceUrl!: boolean;
    @Input() state?: { [k: string]: any };
    @Input() identity: string;
    private commands: any[] = [];
    private subscription: Subscription;
    private preserve!: boolean;
    @HostBinding() href!: string;
  
    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private locationStrategy: LocationStrategy
    ) {
      console.log("queryParams",this.identity)
      this.subscription = router.events.subscribe((s: any) => {
        // console.log('ssssssssss',s)
        if (s instanceof NavigationEnd) {
          this.updateTargetUrlAndHref();
        }
      });
    }
  
    @Input()
    set panelAddLink(commands: any[] | string) {
      if (commands != null && commands !== '') {
        this.commands = Array.isArray(commands) ? commands : [commands];
      } else {
        this.commands = [];
      }
      this.commands = [{ outlets: { claim: [ 'add',  ...this.commands] } }];
    }
  
    @Input()
    set preserveQueryParams(value: boolean) {
      if (isDevMode() && <any>console && <any>console.warn) {
        console.warn(
          'preserveQueryParams is deprecated, use queryParamsHandling instead.'
        );
      }
      this.preserve = value;
    }
  
    ngOnChanges(changes: {}): any {
      this.updateTargetUrlAndHref();
    }
    ngOnDestroy(): any {
      this.subscription.unsubscribe();
    }
  
    @HostListener('click', [
      '$event.button',
      '$event.ctrlKey',
      '$event.metaKey',
      '$event.shiftKey'
    ])
    onClick(
      button: number,
      ctrlKey: boolean,
      metaKey: boolean,
      shiftKey: boolean
    ): boolean {
      if (button !== 0 || ctrlKey || metaKey || shiftKey) {
        return true;
      }
  
      if (typeof this.target === 'string' && this.target !== '_self') {
        return true;
      }
  
      const extras = {
        skipLocationChange: attrBoolValue(this.skipLocationChange),
        replaceUrl: attrBoolValue(this.replaceUrl),
        state: this.state
      };
      this.router.navigateByUrl(this.urlTree, extras);
      return false;
    }
  
    private updateTargetUrlAndHref(): void {
      this.href = this.locationStrategy.prepareExternalUrl(
        this.router.serializeUrl(this.urlTree)
      );
    }
  
    get urlTree(): UrlTree {
      return this.router.createUrlTree(this.commands, {
        relativeTo: this.route,
        queryParams: this.queryParams,
        fragment: this.fragment,
        preserveQueryParams: attrBoolValue(this.preserve),
        queryParamsHandling: this.queryParamsHandling,
        preserveFragment: attrBoolValue(this.preserveFragment)
      });
    }
  }
  
  function attrBoolValue(s: any): boolean {
    return s === '' || !!s;
  }