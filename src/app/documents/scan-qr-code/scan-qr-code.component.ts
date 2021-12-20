import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as JSZip from 'jszip';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'app-scan-qr-code',
  templateUrl: './scan-qr-code.component.html',
  styleUrls: ['./scan-qr-code.component.scss']
})
export class ScanQrCodeComponent implements OnInit {
  loader: boolean = false;
  notValid: boolean = false;
  qrString;
  entity: any;
  model;
  constructor(public generalService: GeneralService, private route: ActivatedRoute,public router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
      
      if (params['entity']) {
        this.entity = params['entity'];
      }
    })
  }

  public scanSuccessHandler($event: any) {
    // this.getData($event)
    this.loader = true;
    this.qrString = $event;
    // console.log($event);
    const CERTIFICATE_FILE = "certificate.json";
    const zip = new JSZip();
    zip.loadAsync($event).then((contents) => {
      return contents.files[CERTIFICATE_FILE].async('text')
    }).then(contents => {
      // console.log('con', contents)
      // this.loader = true;
      var signedData = JSON.parse(contents)
      console.log('-----s',signedData)
      var context = {}
      context['signedCredentials'] = signedData
      this.model = JSON.stringify(context);
      this.generalService.getData(this.entity).subscribe((res) => {
        console.log('res', res)
        var attest = {
          "name": "attestation-DIVOC",
          "entityName": "User",
          "entityId": res[0]['osid'],
          "additionalInput": this.model
        }
        console.log(attest);
        this.postData('send', attest);
      });

      // fetch("https://ndear.xiv.in/skills/api/v1/verify", requestOptions)
      //   .then(response => response.json())
      //   .then(result => {
      //     console.log('res', { "signedCredentials": { result } })
      //     if (result.verified) {
      //       this.loader = false;
      //     }
      //     else {
      //       this.loader = false;
      //       // this.scannerEnabled = false;
      //       this.notValid = true;
      //     }
      //   })
      //   .catch(error => console.log('error', error));
    }).catch(err => {
      console.log('err', err)
      // this.loader = false;
      // this.scannerEnabled = false;
      // this.notValid = true;
      // this.enableScanner()
    }
    );
  }

  postData(url, data) {
    this.generalService.postData(url, data).subscribe((res) => {
      console.log('pub res', res);
      this.router.navigate([this.entity, 'documents'])
      // this.documentTypes = res;
    }, (err) => {
      // this.toastMsg.error('error', err.error.params.errmsg)
      console.log('error', err)
    });
  }

}
