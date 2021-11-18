import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {
  certificates: any = [];
  constructor(public router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('certificates')){
      this.certificates = JSON.parse(localStorage.getItem('certificates'));
      console.log(this.certificates)
    }
  }

  close(){
    console.log('here')
    this.router.navigate(['profile','Student']);
  }

}
