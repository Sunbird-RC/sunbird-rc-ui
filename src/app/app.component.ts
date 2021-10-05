import { Component } from '@angular/core';
import { AppConfig } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 // footerText = this.config.getEnv('footerText');
  constructor(private config: AppConfig) {
  }
}
