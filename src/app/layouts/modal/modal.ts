import {
    OnInit,
    AfterViewInit,
    OnDestroy,
    Renderer2,
    RendererFactory2,
    Component
  } from "@angular/core";
  @Component({
    template: ''
  })
  export abstract class ModalPanel implements OnInit, AfterViewInit, OnDestroy {
    show = false;
    private renderer: Renderer2;
    constructor(private renderFactory: RendererFactory2) {
      this.renderer = this.renderFactory.createRenderer(null, null);
    }
  
    ngOnInit() {
      this.renderer.addClass(this.body, "modal-open");
      this.onInit();
    }
  
    ngOnDestroy(): void {
      this.renderer.removeClass(this.body, "modal-open");
      this.onDestroy();
    }
  
    ngAfterViewInit(): void {
      setTimeout(() => (this.show = true), 100);
    }
  
    private get body() {
      return document.getElementsByTagName("body")[0];
    }
  
    onInit() {}
  
    onDestroy() {}
  }
  