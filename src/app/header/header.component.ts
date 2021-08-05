import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @Input() headerFor: string;
  @Input() tab: string;
  logo;
  constructor(
    public router: Router
  ) { 
    
  }

  async ngOnInit() {
    this.logo = environment.logo;
  }
}
