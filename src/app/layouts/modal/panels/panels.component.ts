import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  RendererFactory2,
  Renderer2
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Panel} from  './panel';

@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.css']
})
export class PanelsComponent extends Panel {

  constructor(private router: Router, renderFactory: RendererFactory2) {
      super(renderFactory);
    }


  close() {
    this.show = false;
    setTimeout(() => this.router.navigate([{ outlets: { claim: null } }]), 100);
  }
}