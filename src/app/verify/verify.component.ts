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
    }).then(contents => {
      console.log('con', contents)
      this.loader = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Cookie", "JSESSIONID=BEE076F2D0801811396549DCC158F429; OAuth_Token_Request_State=1ef52fae-6e1a-4395-af75-beb03e9f8bc3");

      var raw = JSON.stringify(contents);

      var requestOptions: any = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("https://ndear.xiv.in/skills/api/v1/verify", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log('res', result)
          if (result.verified) {
            this.success = true;
            this.enableScanner()
          }
          else{
            this.loader = false;
            // this.scannerEnabled = false;
            this.notValid = true;
            this.enableScanner()
          }
        })
        .catch(error => console.log('error', error));
    }).catch(err => {
      console.log('err', err)
      // this.loader = false;
      // this.scannerEnabled = false;
      // this.notValid = true;
      // this.enableScanner()
    }
    );
  }

  // getData(url) {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Api-Key", "93fca97900d72d45cb1d0b24e47eea09c9fa5301158a53341e20bcd8bfed71cb");
  //   myHeaders.append("Content-Type", "application/json");
  //   var requestOptions: any = {
  //     method: 'GET',
  //     headers: myHeaders,
  //     redirect: 'follow'
  //   };

  //   fetch(url, requestOptions)
  //     .then(response => response.json())
  //     .then(result => {
  //       console.log('get-', result);
  //       this.loader = true;
  //       if (result['credentialSubject']) {
  //         this.validate(result)
  //         this.item = result['credentialSubject']['data']['hasCredential'];
  //         this.name = result['credentialSubject']['data']['name'];
  //       } else {
  //         console.log('else-');
  //         this.loader = false;
  //         this.scannerEnabled = false;
  //         this.notValid = true;
  //       }
  //     })
  //     .catch(error => console.log('error', error));
  // }

  validate(result) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "JSESSIONID=BEE076F2D0801811396549DCC158F429; OAuth_Token_Request_State=1ef52fae-6e1a-4395-af75-beb03e9f8bc3");

    var raw = JSON.stringify(result);

    var requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://ndear.xiv.in/skills/api/v1/verify", requestOptions)
      .then(response => response.json())
      .then(result => console.log('res', result))
      .catch(error => console.log('error', error));
  }


}
