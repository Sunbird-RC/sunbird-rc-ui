import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewCertificateComponent implements OnInit {
  certificate: any;
  header = 'blank';
  constructor(private route: ActivatedRoute,public router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
      if(params['id']){
        if(localStorage.getItem('certificates')){
          this.certificate = JSON.parse(localStorage.getItem('certificates'))[params['id']];
          console.log(this.certificate);
        }
      }
    })
  }
  close(){
    console.log('here')
    this.router.navigate(['Student','certificates']);
  }

}
