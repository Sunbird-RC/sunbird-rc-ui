import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general/general.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { SafeUrl } from "@angular/platform-browser";
import { AppConfig } from 'src/app/app.config';


@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss']
})
export class PdfViewComponent implements OnInit {
  item: any;
  recordItems: any;
  vcOsid: any;
  headerName: string = 'records'
  //headerName : string = 'issuer';
  newName = "hello";
  documentName: string;
  pdfName: any;
  public data: any;
  sampleData: any;
  schemaContent: any;
  userJson: any;
  templateName: any;
  oldTemplateName: string;
  description: any;
  pdfResponse: any;
  pdfResponse2: any;
  sanitizer: DomSanitizer;
  base64data: any;
  base64String: string;
  imagePath: any;

  constructor(public router: Router, public route: ActivatedRoute, 
    private config: AppConfig,
    public translate: TranslateService, sanitizer: DomSanitizer,
    public generalService: GeneralService, public http: HttpClient) {
    this.sanitizer = sanitizer;
    this.documentName = this.route.snapshot.paramMap.get('document');
    console.log(this.documentName);
    this.vcOsid = this.route.snapshot.paramMap.get('id');
  
  }

  async ngOnInit() {
    this.injectHTML();
  }

  downloadPDF() {
    this.pdfName = this.documentName;
    let headerOptions = new HttpHeaders({
      'template-key': 'html',
      'Accept': 'application/pdf'
    });
    let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob' };
    // post or get depending on your requirement
    this.http.get(this.config.getEnv('baseUrl')  + '/'  + this.documentName + '/' + this.vcOsid, requestOptions).pipe(map((data: any) => {

      let blob = new Blob([data], {
        type: 'application/pdf' // must match the Accept type
        // type: 'application/octet-stream' // for excel 
      });
      var link = document.createElement('a');
      console.log(blob);
      link.href = window.URL.createObjectURL(blob);
      link.download = this.pdfName + '.pdf';
      link.click();


      window.URL.revokeObjectURL(link.href);


    })).subscribe((result: any) => {
    });

  }


  injectHTML() {

    this.pdfName = this.documentName;
    let headerOptions = new HttpHeaders({
      'template-key': 'html',
      'Accept': 'application/pdf'
    });
    let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob' };
    // post or get depending on your requirement
    this.http.get(this.config.getEnv('baseUrl')  + '/' + this.documentName + '/' + this.vcOsid, requestOptions).pipe(map((data: any) => {

      let blob = new Blob([data], {
        type: 'application/pdf' // must match the Accept type
        // type: 'application/octet-stream' // for excel 
      });
    
      this.pdfResponse = window.URL.createObjectURL(blob);
      this.pdfResponse2 = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfResponse);
      console.log(this.pdfResponse2);
      this.pdfResponse = this.readBlob(blob);
      console.log(this.pdfResponse);

    })).subscribe((result: any) => {
    });
  }

  readBlob(blob) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64String = reader.result;
      console.log('Base64 String - ', base64String);
      return base64String;
     
    }

  }

}