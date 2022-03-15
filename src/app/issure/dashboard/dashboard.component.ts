import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
headerName : string = 'issuer';
cards = [
  {
    'title' : 'Proof of Work',
    'records': 10
  },
  {
    'title' : 'Proof of Skill',
    'records': 11
  }
];
  templatesItems: any;
  issuerInfo: any;

  constructor(public generalService: GeneralService, public router: Router) { 
  }

  ngOnInit(): void {
    this.getDocument();
    this.getIssuer();
  }

  getIssuer() {
    this.generalService.getData('/Issuer').subscribe((res) => {
      console.log(res);
      this.issuerInfo = res[0];
      console.log( this.issuerInfo);
    });
    
  }

  getDocument(){
    let payout = {
      "filters": {}
  }
    this.generalService.getData('/Schema').subscribe((res) => {
    console.log(res);
    this.templatesItems = res;
    });
  }

  openPreview() {
  }

  // openRecord(Doc)
  // {
  //   this.router.navigate(['records'], { state: { item: Doc } });
  // }
}
