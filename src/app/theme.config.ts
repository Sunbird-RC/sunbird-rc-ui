
import { HttpClient } from '@angular/common/http';

export var THEMES: { default: any; dark: any; };

export function initTheme(http: HttpClient) {
  
  return ()  => {

    http.get('./assets/config/config.json').subscribe((res)=>{
       THEMES = {
        default : res['default_theme'],
        dark: res['dark_theme']
      }
    });
  }

}
    
/*export const THEMES = {

  default: {
    primaryColor: "#1987B6",
    secondaryColor: "#e8f3f8",
    bodyBackground: "#F6F8FC",
    cardBackground: "#FFFFFF",
    tagsBackground: "#F4ECFF",
    navLabelColor: "#0098AB",
    headerColor: "#FFFFFF", 
    headerLinkColor: "#0098AB",
    primaryTextColor: "#000000",
    secondaryTextColor: "#000000",
    linkColor: "#443DF6",
    secondaryBtnBgColor: "#e8f3f8",
  },
  dark: {
    primaryColor: "#1987B6",
    secondaryColor: "#1987B6",
    bodyBackground: "#080808",
    cardBackground: "#323232",
    tagsBackground: "#505050",
    navLabelColor: "#0098AB",
    headerColor: "#313131",
    primaryTextColor: "#FFFFFF",
    secondaryTextColor: "#c3c3c3",
    linkColor: "#443DF6",
    secondaryBtnBgColor: "#e8f3f8",

  }
};*/

