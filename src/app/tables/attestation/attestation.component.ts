import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general/general.service';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { AppConfig } from '../../app.config';
import { TranslateService } from '@ngx-translate/core';
import { SchemaService } from 'src/app/services/data/schema.service';

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
        label: 'Note (Maximum Characters limit 250)',
        maxLength: 250,
        description: "note sent on user",
      },
      validation: {
        messages: {
          maxlength: "Maximum Characters limit exceeded (250)"
        }
      }
    }
  ];
  
  entityId: string;
  id: string;
  type: string;
  contact: string;
  noteAdded = false;
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

  apiUrl: string;
  claimData: any;
  attestationData: any;
  entity: any;
  osid: string;
  propertyData = [];
  claimEntity: any;
  claimEntityId: string;
  profileData: any;
  profile: boolean;
  note = "";
  comment = "";
  table: string;
  documents = null;
  notes = [];
  logo: any;
  fileURL: string;
  titleVal: any;
  formSchema: any;
  langKey: string | number;
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public generalService: GeneralService,
     private config: AppConfig, 
     public translate: TranslateService,
     public schemaService: SchemaService
  ) {
    this.logo = this.config.getEnv(localStorage.getItem('ELOCKER_THEME') + '_theme').logoPath;

  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    console.log("router",this.router.url)
    // var tab_url = this.router.url
    this.route.params.subscribe(async params => {
      console.log("-------------------",params)
      this.table = (params['table']).toLowerCase()
      // this.entity = (params['entity']).charAt(0).toUpperCase() + params['entity'].slice(1);
      this.entity = params['entity']
      this.claimId = params['id']
      if((params['entity']).includes('board')){
        console.log("board--",params['entity'])
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
      console.log("res1",res)
      if(res.claim){
        this.claimEntityId = res.claim.entityId
        this.claimEntity = res.claim.entity;
        this.claimData = res.claim;
        this.notes = res.notes;
        const noteDesc = 'This note will be sent to ' + this.claimData?.requestorName;
        this.denyFields[0].templateOptions.description = noteDesc;
        this.noteFields[0].templateOptions.description = noteDesc;

        this.attestationData = JSON.parse(this.claimData.propertyData);

        this.schemaService.getFormJSON().subscribe((FormSchemas) => {
          const temp =  this.claimEntity.toLowerCase() + '-' + 'setup';
          const filtered = FormSchemas.forms.filter(obj => {
            
            return Object.keys(obj)[0] === temp
          })

          this.formSchema = filtered[0][temp]

          if (this.formSchema.langKey) {
            this.langKey = this.formSchema.langKey;
          }

        Object.keys(this.attestationData).forEach(key => {
        if(typeof(this.attestationData[key]) == 'object'){
          this.attestationData = this.attestationData[key][0];
          this.removeCommonFields();
          this.generateData()
        }   
        });

        this.generalService.getData("/"+ this.claimData.propertyURI).subscribe((res) => {
          console.log("res2",res)
          this.attestationData = res;
          this.removeCommonFields();
          this.generateData()
        })


        this.generalService.getData(this.claimEntity+"/"+this.claimEntityId).subscribe((res) => {
          console.log("profileData",res);

          this.profileData = res;
          this.profile = true
          // this.removeCommonFields();
          // this.generateData()
        })

      });
      }
    })

    
    //history.state;
    // this.getStudentData();
  }

  generateData(){    
    for (const [index, [key, value]] of Object.entries(Object.entries(this.attestationData))) {
      console.log("att", key, value)
      if(key === 'documents'){
        this.documents = value;
        console.log("documents", this.documents)
      }
      else{
        // if(Array.isArray(value)){
        //   value.forEach(element => {
        //     for (const [index2, [key2, value2]] of Object.entries(Object.entries(element))) {
        //       var temp_object2 = {};
        //       temp_object2['title'] = (key2).charAt(0).toUpperCase() + key2.slice(1);
        //       temp_object2['value'] = value2;
        //       this.propertyData.push(temp_object2);
        //     }
        //   });
          
        // }else{
        //   var temp_object = {};
        //   temp_object['title'] = (key).charAt(0).toUpperCase() + key.slice(1);
        //   temp_object['value'] = value;
        //   this.propertyData.push(temp_object);
        // }
        const temp_object = {};
         // temp_object['title'] = (key).charAt(0).toUpperCase() + key.slice(1);
          temp_object['title'] = this.check(key);
          temp_object['value'] = value;
          this.propertyData.push(temp_object);
      }
    }
    console.log("propertyData",this.propertyData)
  }


  check(conStr) {
    this.translate.get(this.langKey + '.' + conStr).subscribe(res => {
      const constr = this.langKey + '.' + conStr;
      if (res != constr) {
        this.titleVal = res;
      } else {
        this.titleVal = conStr;
      }
    });
    return this.titleVal;
  }

  removeCommonFields() {
    const commonFields = ['osCreatedAt', 'osCreatedBy', 'osUpdatedAt', 'osUpdatedBy','OsUpdatedBy','_osAttestedData', 'osid','_osClaimId','_osState','Osid', 'InstituteOSID', 'TeacherOSID', 'sorder'];
    commonFields.forEach(element => {
      if(this.attestationData.hasOwnProperty(element)){
        delete this.attestationData[element]
      }
      
    });
    // const filteredArray = this.attestationData.filter(function (x, i) {
    //   return commonFields.indexOf(x[i]) < 0;
    // });
  }

  onAttestApproveReject(action,event) {
    console.log(this.form);
    // if(action == 'REJECT_CLAIM')
    // {
    //   this.note = event.note
    // }

    //this.note = this.denyForm.value.note ? this.denyForm.value.note : this.note;
    const data = {
      "action": action,
      "notes": this.denyForm.value.note ? this.denyForm.value.note : this.note
  }
  console.log("data--",data);
    const url = this.entity+"/claims/"+this.claimId+"/attest"
    this.generalService.postData(url, data).subscribe((res) => {
      // alert('success');
      console.log(res);
      
    });
    this.router.navigate([this.entity,'attestation',this.table]).then(() => {
      window.location.reload();
    });


    //this.noteAdded = true;
    // this.router.navigate(['institute-attestation']);
    // window.location.reload();
  }

 getPathUrl(filepath)
 {
 this.generalService.openPDF('/' + filepath );
 }


  typeOf(value) {
    return typeof value;
  }
 
  saveNote(){
    // localStorage.setItem('note', JSON.stringify(event));
    console.log('evv noteForm -- ', this.noteForm.value.note);
    this.note =  this.noteForm.value.note;
    this.noteAdded = true;
  }

  saveComments(event){
    console.log('evv ',event.comment);
  }

  close(){
    console.log('here')
    this.router.navigate([this.entity,'attestation',this.table]);
  }

}
