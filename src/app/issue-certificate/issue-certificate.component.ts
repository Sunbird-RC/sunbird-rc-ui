import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from "json-schema";
import { GeneralService } from '../services/general/general.service';
import { of as observableOf } from 'rxjs';
import emailjs from 'emailjs-com';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-issue-certificate',
  templateUrl: './issue-certificate.component.html',
  styleUrls: ['./issue-certificate.component.scss']
})
export class IssueCertificateComponent implements OnInit {
  schema: JSONSchema7 = {
    "title": "Issue Certificate",
    "type": "object",
    "required": [
      "student",
      "course",
      "type",
      "date"
    ],
    "properties": {
      "student": {
        "type": "string",
        "title": "Choose Student"
      },
      "type": {
        "type": "string",
        "title": "Certification Type",
        "enum": [
          "Attendance",
          "Skill",
          "Work",
          "Reputation"
        ]
      },
      "course": {
        "type": "string",
        "title": "Course",
        "enum": []
      },
      "skill": {
        "type": "string",
        "title": "Skill",
        "enum": []
      },
      "grade": {
        "type": "string",
        "title": "Grade"
      },
      "date": {
        "type": "string",
        "title": "Awarded on",
      }
    }
  };
  form2: FormGroup;
  model = {};
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];
  searchResult: any[];
  formData = {};
  requestOptions = {};
  isAuthenticated = false;
  accessToken;
  did;
  signedCredential: any;
  generated: boolean = false;
  qrCode: any;
  blob: Blob;
  institute: any;
  course;
  skill: any;
  certificates: any = [];
  constructor(private formlyJsonschema: FormlyJsonschema, public generalService: GeneralService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
      if(params['course']){
        this.course = params['course']
      }
      if(params['skill']){
        this.skill = params['skill']
      }
    });
    if(localStorage.getItem('certificates')){
      this.certificates = JSON.parse(localStorage.getItem('certificates'));
    }
    this.schema.properties.course['widget'] = {
      "formlyConfig": {
        "templateOptions": {
        }
      }
    }
    // this.schema.properties.course['widget']['formlyConfig']['defaultValue'] = this.course;
    this.schema.properties.course['widget']['formlyConfig']['hideExpression'] = (model) => this.model['type'] != 'Attendance'
    if(localStorage.getItem('course')){
      this.schema.properties.course['enum'].push(JSON.parse(localStorage.getItem('course'))['course']);
    }
    this.schema.properties.skill['widget'] = {
      "formlyConfig": {
        "templateOptions": {
        }
      }
    }
    // this.schema.properties.skill['widget']['formlyConfig']['defaultValue'] = this.skill;
    this.schema.properties.skill['widget']['formlyConfig']['hideExpression'] = (model) => this.model['type'] != 'Skill'
    if(localStorage.getItem('skill')){
      this.schema.properties.skill['enum'].push(JSON.parse(localStorage.getItem('skill'))['course']);
    }
    this.schema.properties.grade['widget'] = {
      "formlyConfig": {
        "templateOptions": {
        }
      }
    }
    this.schema.properties.grade['widget']['formlyConfig']['hideExpression'] = (model) => this.model['type'] != 'Skill'
    this.schema.properties.student['widget'] = {
      "formlyConfig": {
        "templateOptions": {
        },
        "validation": {},
        "expressionProperties": {},
        "modelOptions": {}
      }
    }
    this.schema.properties.student['widget']['formlyConfig']['type'] = "autocomplete";
    this.schema.properties.student['widget']['formlyConfig']['templateOptions']['placeholder'] = "Student";
    this.schema.properties.student['widget']['formlyConfig']['templateOptions']['label'] = "identityDetails.fullName";
    var dataval = "{{value}}"
    this.schema.properties.student['widget']['formlyConfig']['templateOptions']['search$'] = (term) => {
      if (term || term != '') {
        var formData = {
          "filters": {
            "identityDetails.fullName": {
              "contains": term
            }
          },
          "limit": 20,
          "offset": 0
        }
        // formData.filters[field.key] = {};
        // formData.filters[field.key]["contains"] = term
        dataval = term;
        this.generalService.postData("https://ndear.xiv.in/skills/api/v1/Student/search", formData).subscribe(async (res) => {
          let items = res;
          items = items.filter(x => x['identityDetails']['fullName'].toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
          if (items) {
            this.searchResult = items;
            return observableOf(this.searchResult);
          }
        });
      }
      return observableOf(this.searchResult);
    }
    this.schema.properties.date['widget'] = {
      "formlyConfig": {
        "templateOptions": {
        }
      }
    }
    this.schema.properties.date['widget']['formlyConfig']['templateOptions']['type'] = 'date';
    this.form2 = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];
    this.generalService.getData('/Institute').subscribe((res) => {
      this.institute = res[0].instituteName;
      console.log(this.institute);
    });
    // this.getData();
  }

  submit() {
    console.log(this.model);
    this.signUp()
  }

  signUp() {
    this.formData = {
      "username": (this.model['student']).replace(" ", "").replace(" ", ""),
      "password": "Test@1234",
      "options": {
        "didMethod": "elem",
        "keyTypes": [
          "rsa"
        ]
      },
      "messageParameters": {
        "message": "Hello message",
        "subject": "test subject",
        "htmlMessage": "test html message"
      }
    }
    var myHeaders = new Headers();
    myHeaders.append("Api-Key", "93fca97900d72d45cb1d0b24e47eea09c9fa5301158a53341e20bcd8bfed71cb");
    myHeaders.append("Content-Type", "application/json");

    this.requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(this.formData),
      redirect: 'follow'
    };

    fetch("https://cloud-wallet-api.prod.affinity-project.org/api/v1/users/signup", this.requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('signup--', result);
        if (result['accessToken'] && result['did']) {
          this.isAuthenticated = true;
          this.accessToken = result['accessToken'];
          this.did = result['did'];
          this.unsigned();
        } else {
          this.login();
        }
      });
  }

  login() {
    var myHeaders = new Headers();
    myHeaders.append("Api-Key", "93fca97900d72d45cb1d0b24e47eea09c9fa5301158a53341e20bcd8bfed71cb");
    myHeaders.append("Content-Type", "application/json");
    this.formData = {
      "username": (this.model['student']).replace(" ", "").replace(" ", ""),
      "password": "Test@1234"
    }
    this.requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(this.formData),
      redirect: 'follow'
    };

    fetch("https://cloud-wallet-api.prod.affinity-project.org/api/v1/users/login", this.requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('login--', result);
        console.log('login2--', result['accessToken'] && result['did']);
        if (result['accessToken'] && result['did']) {
          this.isAuthenticated = true;
          this.accessToken = result['accessToken'];
          this.did = result['did'];
          this.unsigned();
        }
      });
  }

  unsigned() {
    console.log('issueCertificate');
    var myHeaders = new Headers();
    myHeaders.append("Api-Key", "93fca97900d72d45cb1d0b24e47eea09c9fa5301158a53341e20bcd8bfed71cb");
    myHeaders.append("Content-Type", "application/json");

    this.formData = {
      "type": "EducationCredentialPersonV1",
      "data": {
        "@type": [
          "Person",
          "PersonE",
          "EducationPerson"
        ],
        "name": this.model['student'],
        "hasCredential": {
          "@type": "EducationalOcupationalCredential",
          "credentialCategory": this.model['type'],
          "educationalLevel": this.model['course'],
          "recognizedBy": {
            "@type": [
              "Organization",
              "OrganizationE"
            ],
            "name": this.institute
          },
          "dateCreated": this.model['date'],
          "url": `${window.location.protocol + "//" + window.location.host}/credentials`
        }
      },
      "holderDid": this.did
    }

    this.requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(this.formData),
      redirect: 'follow'
    };

    fetch("https://affinity-issuer.prod.affinity-project.org/api/v1/vc/build-unsigned", this.requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('unsigned--', result)
        if (result['unsignedCredential']) {
          this.sign(result['unsignedCredential'])
        }
      })
      .catch(error => console.log('error', error));
  }

  sign(unsinedData) {
    var myHeaders = new Headers();
    myHeaders.append("Api-Key", "93fca97900d72d45cb1d0b24e47eea09c9fa5301158a53341e20bcd8bfed71cb");
    myHeaders.append("Authorization", "Bearer " + this.accessToken);
    myHeaders.append("Content-Type", "application/json");

    this.formData = {
      "unsignedCredential": unsinedData,
      "keyType": "rsa"
    }
    this.requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(this.formData),
      redirect: 'follow'
    };

    fetch("https://cloud-wallet-api.prod.affinity-project.org/api/v1/wallet/sign-credential", this.requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('sign--', result);
        if (result['signedCredential']) {
          this.signedCredential = result['signedCredential'];
          this.store(result['signedCredential']);
        }
      })
      .catch(error => console.log('error', error));
  }

  store(sinedData) {
    var myHeaders = new Headers();
    myHeaders.append("Api-Key", "93fca97900d72d45cb1d0b24e47eea09c9fa5301158a53341e20bcd8bfed71cb");
    myHeaders.append("Authorization", "Bearer " + this.accessToken);
    myHeaders.append("Content-Type", "application/json");

    this.formData = {
      "data": [
        sinedData
      ]
    }

    this.requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(this.formData),
      redirect: 'follow'
    };

    fetch("https://cloud-wallet-api.prod.affinity-project.org/api/v1/wallet/credentials", this.requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('store-', result);
        if (result['credentialIds']) {
          this.share(result['credentialIds'][0])
        }
      })
      .catch(error => console.log('error', error));
  }

  share(claimId) {
    var myHeaders = new Headers();
    myHeaders.append("Api-Key", "93fca97900d72d45cb1d0b24e47eea09c9fa5301158a53341e20bcd8bfed71cb");
    myHeaders.append("Authorization", "Bearer " + this.accessToken);

    var raw = "";

    this.requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://cloud-wallet-api.prod.affinity-project.org/api/v1/wallet/credentials/" + claimId + "/share", this.requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('share-', result,this.institute);
        if (result['qrCode']) {
          this.generated = true;
          this.qrCode = result['qrCode'];
          var shareUrl = result['sharingUrl'].split('?key=')[0];
          var key = result['sharingUrl'].split('?key=')[1];
          result['data'] = this.model;
          result['data']['issuer'] = this.institute;
          this.certificates.push(result);
          localStorage.setItem('certificates', JSON.stringify(this.certificates));
          // var templateParams: any = {
          //   name: this.model['student'],
          //   code: result['qrCode'],
          //   reply_to: 'paraspatel1434@gmail.com',
          //   link: `${window.location.protocol + "//" + window.location.host}/credentials?vcURL=${shareUrl}&key=${key}`,
          // };
          // emailjs.send('service_mihqxlf', 'template_heqihvf', templateParams, 'user_AB0BwpSVS4CHaQvPGkYsQ')
          //   .then(function (response) {
          //     console.log('SUCCESS!', response.status, response.text);
          //   }, function (err) {
          //     console.log('FAILED...', err);
          //   });
        }
      })
      .catch(error => console.log('error', error));
  }


}
