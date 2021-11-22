import { Component, OnInit } from '@angular/core';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  scannerEnabled;
  success: boolean = false;
  qrString;
  item;
  loader: boolean = false;
  notValid: boolean = false;
  name: any;
  constructor() { }

  ngOnInit(): void {
  }

  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;

  }

  public scanSuccessHandler($event: any) {
    // this.getData($event)

    this.qrString = $event;
    console.log($event);
    const CERTIFICATE_FILE = "certificate.json";
    const zip = new JSZip();
    zip.loadAsync($event).then((contents) => {
      return contents.files[CERTIFICATE_FILE].async('text')
    }).then(function (contents) {
      console.log('con',contents)
    }).catch(err => {
      console.log('err',err)
    }
    );
  }

  getData(url) {
    var myHeaders = new Headers();
    myHeaders.append("Api-Key", "93fca97900d72d45cb1d0b24e47eea09c9fa5301158a53341e20bcd8bfed71cb");
    myHeaders.append("Content-Type", "application/json");
    var requestOptions: any = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('get-', result);
        this.loader = true;
        if (result['credentialSubject']) {
          this.validate(result)
          this.item = result['credentialSubject']['data']['hasCredential'];
          this.name = result['credentialSubject']['data']['name'];
        } else {
          console.log('else-');
          this.loader = false;
          this.scannerEnabled = false;
          this.notValid = true;
        }
      })
      .catch(error => console.log('error', error));
  }

  validate(result) {
    var myHeaders = new Headers();
    myHeaders.append("Api-Key", "93fca97900d72d45cb1d0b24e47eea09c9fa5301158a53341e20bcd8bfed71cb");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "verifiableCredentials": [result] });

    var requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://affinity-verifier.prod.affinity-project.org/api/v1/verifier/verify-vcs", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('validate-', result);
        if (result['isValid'] && result['isValid'] == true) {
          this.success = true;
        } else {
          this.notValid = true;
        }
        this.loader = false;
        this.scannerEnabled = false;

      })
      .catch(error => console.log('error', error));
  }


}
