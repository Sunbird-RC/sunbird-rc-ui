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
    this.generalService.getData('Issuer').subscribe((res) => {
      console.log(res);
      this.issuerInfo = res[0];
      console.log( this.issuerInfo);
    });
    
  }

  getDocument(){
    let payout = {
      "filters": {}
  }
    this.generalService.getData('Schema').subscribe((res) => {
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


   injectHTML() {

    const iframe: HTMLIFrameElement = document.getElementById('test_iframe') as HTMLIFrameElement;
    //step 1: get the DOM object of the iframe.
   // var iframe = document.getElementById('test_iframe');
  
    var html_string = '<html><head></head><body><p style="color:blue">iframe content injection</p></body></html>';
  
    /* if jQuery is available, you may use the get(0) function to obtain the DOM object like this:
    var iframe = $('iframe#target_iframe_id').get(0);
    */
  
    // step 2: obtain the document associated with the iframe tag
    // most of the browser supports .document. 
    // Some supports (such as the NetScape series) .contentDocumet, 
    // while some (e.g. IE5/6) supports .contentWindow.document
    // we try to read whatever that exists.
   
      var iframedoc = iframe.contentWindow.document;
  
    if (iframedoc) {
      // Put the content in the iframe
      iframedoc.open();
      iframedoc.writeln(html_string);
      iframedoc.close();
    } else {
      //just in case of browsers that don't support the above 3 properties.
      //fortunately we don't come across such case so far.
      alert('Cannot inject dynamic contents into iframe.');
    }
  }
  
}
