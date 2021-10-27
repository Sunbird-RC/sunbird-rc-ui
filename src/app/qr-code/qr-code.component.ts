import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {

  constructor(private route: ActivatedRoute, public router: Router) { }
  link;
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = '';
  header = 'blank';
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (params['vcURL'] && params['key']) {
        this.value = params['vcURL']+'?key='+params['key'];
      }
    });
  }

 
}
