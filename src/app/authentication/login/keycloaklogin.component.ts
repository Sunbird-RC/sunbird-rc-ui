import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-keycloaklogin',
  templateUrl: './keycloaklogin.component.html',
  styleUrls: ['./keycloaklogin.component.css']
})
export class KeycloakloginComponent implements OnInit {
  user : any;
  entity: string;
  profileUrl: string  = '';
  constructor(
    public keycloakService: KeycloakService,
    public router: Router

  ) { }

  ngOnInit(): void {
    this.keycloakService.loadUserProfile().then((res)=>{
      console.log(res['attributes'].entity[0]);

      this.entity = res['attributes'].entity[0];
    });
    this.user = this.keycloakService.getUsername();
    this.keycloakService.getToken().then((token)=>{
      console.log('keyCloak teacher token - ', token);
      localStorage.setItem('token', token);
      localStorage.setItem('loggedInUser', this.user);
     // alert(this.entity);
     this.profileUrl = '/profile/'+this.entity;

      // switch(this.entity)
      // {
      //   case 'Student' :
      //   // this.profileUrl = '/student-profile';
      //   this.profileUrl = '/profile/'+this.entity;
      //   break;

      //   case 'Teacher' : 
      //   this.profileUrl = '/profile/'+this.entity;
      //   break;

      //   case 'Institute' : 
      //   this.profileUrl = '/institute-profile';
      //   break;

      // }

      this.router.navigate([this.profileUrl]);

    });
  }


}
