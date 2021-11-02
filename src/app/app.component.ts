import { Component } from '@angular/core';
import { AppConfig } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  footerText = 'Sunbird RC'
  constructor(private config: AppConfig) {
    if(window.location.pathname != '/install'){
      this.footerText = this.config.getEnv('footerText');
    }
  }
}
