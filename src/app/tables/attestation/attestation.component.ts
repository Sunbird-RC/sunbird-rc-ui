import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general/general.service';

import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'app-form-detail',
  templateUrl: './attestation.component.html',
  styleUrls: ['./attestation.component.css']
})
export class AttestationComponent implements OnInit {

  noteForm = new FormGroup({});
  denyForm = new FormGroup({});

  model: any = {};
  options: FormlyFormOptions = {};

  denyFields: FormlyFieldConfig[] = [
    {
      key: 'note',
      type: 'textarea',
      templateOptions: {
        label: 'Reason for denied',
        required: true,
        description: "This note will be sent to user",
        placeholder: "Type message here"
      }
    }
  ];

  noteFields: FormlyFieldConfig[] = [
    {
      key: 'note',
      type: 'textarea',
      templateOptions: {
        label: 'Note',
        required: true,
        description: "note sent on user"
      }
    }
  ];

  entityId: string;
  user: any;
  education: any;
  educationDetail: any;
  experience: any;
  experienceDetail: any;
  id: string;
  type: string;
  contact: string;
  consent: any = false;
  noteAdded: boolean = false;
  claimId: string;
  entityIdt: string;

  approveNoteSchema = {
    "type": "object",
    "title": "Invite",
    "properties": {
      "note": {
        "type": "string",
      },
    }
  }

  commentSchema = {
    "type": "object",
    "title": "Comments",
    "properties": {
      "comment": {
        "type": "string",
      },
    }
  }

  denyNoteSchema = {
    "type": "object",
    "title": "Invite",
    "required": [
      "note"
    ],
    "properties": {
      "note": {
        "title": "Reason for deny",
        "type": "textarea",
      },
    }
  }

  form = [
    {
      "key": "note",
      "type": "textarea",
      "placeholder": "Type message here.. "
    },
    {
      "type": "submit",
      "style": "btn btn-primary text-end mb-3 fw-bold text-capitalize",
      "title": "Submit"
    }
  ]

  form1 = [
    {
      "key": "comment",
      "type": "textarea",
      "placeholder": "Add a Comment..."
    },
    {
      "type": "submit",
      "style": "btn btn-primary text-end mb-3 fw-bold text-capitalize",
      "title": "Save"
    }
  ]

  apiUrl: any;
  claimData: any;
  attestationData: any;
  entity: any;
  osid: any;
  propertyData: any[] = [];
  claimEntity: any;
  claimEntityId: any;
  profileData: any;
  profile: boolean;
  note: any = "";
  comment: any = "";
  table: any;
  documents = null;
  notes: any[] = [];
  commonFields = ['osCreatedAt', 'osCreatedBy', 'osUpdatedAt', 'osUpdatedBy', 'OsUpdatedBy', '_osAttestedData', 'osid', '_osClaimId', '_osState', 'Osid', 'OsUpdatedAt', 'Attest'];
  isObject(val): boolean {
    try {
      JSON.parse(val);
    } catch (e) {
      return false;
    }
    return true;
  }
  listObject(val): object {
    return JSON.parse(val);
  }
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public generalService: GeneralService
  ) {
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    console.log("router", this.router.url)
    // var tab_url = this.router.url
    this.route.params.subscribe(async params => {
      console.log("-------------------", params)
      this.table = (params['table']).toLowerCase()
      // this.entity = (params['entity']).charAt(0).toUpperCase() + params['entity'].slice(1);
      this.entity = params['entity'];
      this.claimId = params['id']
      if ((params['entity']).includes('board')) {
        console.log("board--", params['entity'])
        this.entity = params['entity']
      }
      this.apiUrl = `/${this.entity}/claims/${this.claimId}`;
      // await this.getData();
    });

    // this.generalService.getData("/"+this.entity).subscribe((res) => {
    //   console.log("res1",res)
    //   this.osid = res[0].osid;
    // })

    this.generalService.getData(this.apiUrl).subscribe((res) => {
      // this.entityIdt = res[0].osid;
      console.log("res1", res)
      if (res.claim) {
        this.claimEntityId = res.claim.entityId
        this.claimEntity = res.claim.entity;
        this.claimData = res.claim;
        this.notes = res.notes;
        let noteDesc = 'This note will be sent to ' + this.claimData?.requestorName;
        this.denyFields[0].templateOptions.description = noteDesc;
        this.noteFields[0].templateOptions.description = noteDesc;

        this.generalService.getData("/" + this.claimData.propertyURI).subscribe((res) => {
          console.log("res2", res)
          this.attestationData = this.removeCommonFields(res);
          this.generateData()
        })
        this.generalService.getData(this.claimEntity + "/" + this.claimEntityId).subscribe((res) => {
          console.log("profileData", res);

          this.profileData = res;
          this.profile = true
          // this.removeCommonFields();
          // this.generateData()
        })
      } else {
        this.claimEntityId = res.entityId
        this.claimEntity = res.entity;
        this.claimData = res;
        this.notes = res.notes;
        let noteDesc = 'This note will be sent to ' + this.claimData?.requestorName;
        this.denyFields[0].templateOptions.description = noteDesc;
        this.noteFields[0].templateOptions.description = noteDesc;

        this.generalService.getData("/" + this.claimData.propertyURI).subscribe((res) => {
          console.log("res2", res)
          this.attestationData = this.removeCommonFields(res);

          this.generateData()
        })
        this.generalService.getData(this.claimEntity + "/" + this.claimEntityId).subscribe((res) => {
          console.log("profileData", res);

          this.profileData = res;
          this.profile = true
          // this.removeCommonFields();
          // this.generateData()
        })
      }
    })


    //history.state;
    // this.getStudentData();
  }

  generateData() {
    for (var [index, [key, value]] of Object.entries(Object.entries(this.attestationData))) {
      console.log("att", key, typeof value)
      if (key === 'documents') {
        this.documents = value;
        console.log("documents", this.documents)
      }
      else {
       /* if (Array.isArray(value)) {
          var temp_value = [];
          if (typeof value[0] === 'object') {
            value.forEach(element => {
              for (var [index2, [key2, value2]] of Object.entries(Object.entries(element))) {
                if (Array.isArray(value2)) {
                  var temp_value2 = [];
                  value2.forEach(element2 => {
                    for (var [index3, [key3, value3]] of Object.entries(Object.entries(element2))) {
                      var temp_object3 = {};
                      temp_object3['title'] = (key3).charAt(0).toUpperCase() + key3.slice(1);
                      temp_object3['value'] = value3;
                      temp_value2.push(temp_object3);
                    }
                  });


                  temp_value.push(temp_value2)
                }
                var temp_object2 = {};
                temp_object2['title'] = (key2).charAt(0).toUpperCase() + key2.slice(1);
                temp_object2['value'] = value2;
                temp_value.push(temp_object2);
              }
            });
          }
          // } else {
          //   value = value.join(', ');
          // }



          value = JSON.stringify(temp_value)
        }*/
        // }else{
        //   var temp_object = {};
        //   temp_object['title'] = (key).charAt(0).toUpperCase() + key.slice(1);
        //   temp_object['value'] = value;
        //   this.propertyData.push(temp_object);
        // }
        var temp_object = {};
        // if (Array.isArray(value)) {
        //   console.log("arrry",value);
        //   value = value.join(', ');
        // }
        // if (typeof value === 'object') {
        //   value = JSON.stringify(value);
        //   console.log("objjj",value);
        // };
        temp_object['title'] = (key).charAt(0).toUpperCase() + key.slice(1);
        temp_object['value'] = value;
        this.propertyData.push(temp_object);
      }
    }
    console.log("propertyData", this.propertyData)
  }

  removeCommonFields(data) {
    this.commonFields.forEach(element => {
      if (data.hasOwnProperty(element)) {
        delete data[element]
      }

    });
    return data;
    // const filteredArray = this.attestationData.filter(function (x, i) {
    //   return commonFields.indexOf(x[i]) < 0;
    // });
  }

  onAttestApproveReject(action, event) {
    console.log(this.form);
    // if(action == 'REJECT_CLAIM')
    // {
    //   this.note = event.note
    // }

    //this.note = this.denyForm.value.note ? this.denyForm.value.note : this.note;
    let data = {
      "action": action,
      "notes": this.denyForm.value.note ? this.denyForm.value.note : this.note
    }
    console.log("data--", data);
    var url = this.entity + "/claims/" + this.claimId + "/attest"
    this.generalService.postData(url, data).subscribe((res) => {
      // alert('success');
      console.log(res);

    });
    this.router.navigate([this.entity, 'attestation', this.table]).then(() => {
      window.location.reload();
    });


    //this.noteAdded = true;
    // this.router.navigate(['institute-attestation']);
    // window.location.reload();
  }

  onConsent() { }

  saveNote(event) {
    // localStorage.setItem('note', JSON.stringify(event));
    console.log('evv', event.note);
    this.note = event.note
    this.noteAdded = true;
  }

  saveComments(event) {
    console.log('evv ', event.comment);
  }

  close() {
    console.log('here')
    this.router.navigate([this.entity, 'attestation', this.table]);
  }

}
