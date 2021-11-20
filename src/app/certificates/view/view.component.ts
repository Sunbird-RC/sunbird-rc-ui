import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewCertificateComponent implements OnInit {
  certificate: any;
  header = 'blank';
  url;
  constructor(private route: ActivatedRoute, public router: Router,public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
      if (params['id']) {
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/pdf");
        myHeaders.append("Cookie", "JSESSIONID=BEE076F2D0801811396549DCC158F429; OAuth_Token_Request_State=1ef52fae-6e1a-4395-af75-beb03e9f8bc3");

        var requestOptions:any = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch("https://ndear.xiv.in/skills/api/v1/Certificates/"+params['id'], requestOptions)
          .then(response => response.blob())
          .then(result => {
            var blob = new Blob([result], {type: 'application/pdf'});
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob))
            console.log(this.url);
            // var _iFrame = document.createElement('iframe');
            // _iFrame.setAttribute('src', this.url);
            // _iFrame.setAttribute('style', 'visibility:hidden;');
          })
          .catch(error => console.log('error', error));
        // if(localStorage.getItem('certificates')){
        //   this.certificate = JSON.parse(localStorage.getItem('certificates'))[params['id']];
        //   console.log(this.certificate);
        // }
      }
    })
  }
  close() {
    console.log('here')
    this.router.navigate(['profile','Student']);
  }

}
