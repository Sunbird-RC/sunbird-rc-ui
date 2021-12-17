import { Component } from '@angular/core';
import { AppConfig } from './app.config';
import { ThemeService } from "../app/services/theme/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  footerText = 'Sunbird RC';
  themeName;
  constructor(private config: AppConfig, private themeService: ThemeService) {
    if(window.location.pathname != '/install'){
      this.footerText = this.config.getEnv('footerText');
    }

    this.themeName = localStorage.getItem('themeName');

    if (this.themeName) {
      this.themeService.setTheme(this.themeName);
    }
  }
}
