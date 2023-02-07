import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.scss']
})
export class CreateCertificateComponent implements OnInit {
  @ViewChild("userHtml", { static: false }) userHtml;

  constructor(public translate: TranslateService,) { }

  ngOnInit(): void {
  }

}
