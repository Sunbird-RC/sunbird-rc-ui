import { Component, OnInit } from '@angular/core';
import { PanelsComponent } from  '../panels.component';
import { Location } from '@angular/common'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.scss']
})
export class EditPanelComponent implements OnInit {
  form: any;
  identifier: string;

  constructor(private panel: PanelsComponent, private location: Location, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.form = params['form'].split('/', 1)[0];
      this.identifier = params['form'].split('/', 1)[1];
    });
    if(localStorage.getItem('entity-osid')){
      this.identifier = localStorage.getItem('entity-osid')
    }
    else{
      console.log("Not Authorized")
    }
    
  }

  close() {
    this.location.back()
    this.panel.close();
  }
}
