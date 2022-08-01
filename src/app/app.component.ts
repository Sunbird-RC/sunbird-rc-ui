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
  isFooter = false;
  ELOCKER_THEME;
  constructor(private config: AppConfig, private themeService: ThemeService) {
    
     if(this.config.getEnv('appType') && this.config.getEnv('appType') != 'digital_wallet'){
      this.isFooter = true;
      if(window.location.pathname != '/install'){
        this.footerText = this.config.getEnv('footerText');
      }
    }
    
   
    this.ELOCKER_THEME = localStorage.getItem('ELOCKER_THEME');

    if (this.ELOCKER_THEME) {
      this.themeService.setTheme(this.ELOCKER_THEME);
    }

    // changeTheme() {
    //   if (this.ELOCKER_THEME == 'default') {
    //     this.ELOCKER_THEME = "dark";
    //   } else {
    //     this.ELOCKER_THEME = "default";
    //   }
    //   this.themeService.setTheme(this.ELOCKER_THEME);
    //   localStorage.setItem('ELOCKER_THEME', this.ELOCKER_THEME);
  //  }


  }
}
