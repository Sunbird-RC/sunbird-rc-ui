import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../services/general/general.service';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  installed: boolean = false;
  checkbox: any;
  constructor(public router: Router,private config: AppConfig) { }

  ngOnInit(): void {
    // this.generalService.getConfigs().subscribe((res) => {
    //   if(res.installed) {
    //     console.log("----------------------",this.config.getEnv('baseUrl'))
    //     this.installed = true;
    //   }
    //   else {
    //     this.router.navigate(['install'])
    //   }
    // }, error => {
    //   this.router.navigate(['install'])
    // });


    var handler = document.getElementById('menu-open-handler');
    var toggleInterval = setInterval(function(){
      this.checkbox = document.getElementById('menu-open');
      this.checkbox.checked = !this.checkbox.checked;
    }, 4000);

    handler.onclick = function(){
      clearInterval(toggleInterval);
    };

  }

}
