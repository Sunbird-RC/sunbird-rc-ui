import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from "json-schema";
import { GeneralService } from 'src/app/services/general/general.service';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
import { SchemaService } from '../../services/data/schema.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'add-certificate',
  templateUrl: './add-certificate.component.html',
  styleUrls: ['./add-certificate.component.scss']
})
export class AddCertificateComponent implements OnInit {
  //@ViewChild("userHtml", { static: false }) userHtml;
  userHtml;
  userJson;
  form2: FormGroup;
  model = {};
  schemaloaded = false;
  template;

  orders = ["", "Proof of work",
    "Proof of skill",
    "Proof of Education"]
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];
  schema: JSONSchema7 = {
    "type": "object",
    "title": "",
    "definitions": {},
    "properties": {},
    "required": []
  };
  form: string;
  formSchema: any;
  responseData: any;
  definations: any;
  property: any;
  htmlFile = "/assets/template/first.html";
  templatePath: any;
  isPreview = false;
  templateName: any;
  issuerOsid: any;
  documentTypeList: any;
  selectedDecType: any;
  description: any;
  schemaJson: Object;
  schemaContent: any;
  certificateContent: any;
  oldTemplateName;
  constructor(public schemaService: SchemaService,
    public toastMsg: ToastMessageService,
    public router: Router,
    private route: ActivatedRoute,
    private formlyJsonschema: FormlyJsonschema,
    public generalService: GeneralService,
    public http: HttpClient) { }

  ngOnInit(): void {


    // this.http.get('https://sunbird-certificate-demo.xiv.in/github/dileepbapat/ref-sunbirdrc-certificate/main/schemas/TrainingCertificate.json').subscribe((res)=>{
    //   console.log({res});
    //  }, err => {
    //   console.log(err.message);
    // })  

    // this.generalService.getData('/github/dileepbapat/ref-sunbirdrc-certificate/main/schemas/TrainingCertificate.json').subscribe((res)=>{
    //   console.log({res});
    //  }, err => {
    //   console.log(err.message);
    // })  
    
    
     
  //  this.isPreview = (localStorage.getItem('isPreview') == 'yes') ? true : false;

    this.getDocument();

    // if (localStorage.getItem('iframe')) {
    //   fetch(localStorage.getItem('iframe'))
    //     .then(response => response.text())
    //     .then(data => {
    //       this.userHtml = data;
    //     });
    // }


    if (localStorage.getItem('content')) {
      console.log('------------------- ', JSON.parse(localStorage.getItem('content')));
      this.previewScreen(JSON.parse(localStorage.getItem('content')));
    }

    this.route.params.subscribe(params => {
      console.log(params);
      if (params['form'] != undefined) {
        this.form = params['form'].split('/', 1)[0];
      }
    });


    // this.schemaService.getFormJSON().subscribe((FormSchemas) => {
    //   var filtered = FormSchemas.forms.filter(obj => {
    //     return Object.keys(obj)[0] === this.form
    //   })
    //   this.formSchema = filtered[0][this.form];
    //   this.templatePath = filtered[0][this.form]['template'];

    //   this.schemaService.getSchemas().subscribe((res) => {
    //     this.responseData = res;
    //     this.formSchema.fieldsets.forEach(fieldset => {

    //       this.definations = this.responseData.definitions;
    //       this.property = this.definations[fieldset.definition].properties;


    //       this.schema["type"] = "object";
    //       this.schema["title"] = this.formSchema.title;
    //       this.schema["definitions"] = this.definations;
    //       this.schema["properties"] = this.property;
    //       this.loadSchema();
    //     });
    //   });

    // }, (error) => {
    //   this.toastMsg.error('error', 'forms.json not found in src/assets/config/ - You can refer to examples folder to create the file')
    // })

    this.generalService.getData('/Issuer').subscribe((res) => {
      console.log(res);
      this.issuerOsid = res[0].osid;
    });
   
  }

  // loadSchema() {
  //   this.form2 = new FormGroup({});
  //   this.options = {};
  //   this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];

  //   this.schemaloaded = true;
  // }

  dataChange() {
    window.location.reload();
  }

  cancel() {
    this.isPreview = false;
    localStorage.setItem('content' , '');
  }

  previewScreen(doc) {
    console.log({doc});

    //this.isPreview = true;
    localStorage.setItem('content' , JSON.stringify(doc));
 /*this.http.get('assets/template/schema.json').subscribe((res)=>{
    console.log({res});
    this.schemaJson =res;

    this.schemaJson['certificateTemplate'] = { 'html' : "https://sunbird-certificate-demo.xiv.in" + "/github/dileepbapat/ref-sunbirdrc-certificate/main/schemas/templates/TrainingCertificate.html"}
    
    console.log(JSON.stringify(this.schemaJson));
   }, err => {
    console.log(err.message);
  });*/

  fetch( doc.schemaUrl)
  .then(response => response.text())
  .then(data => {
    this.schemaContent = data;
this.userJson = data;
  	// Do something with your data
  	console.log(this.userJson);
  });

  fetch( doc.certificateUrl)
  .then(response => response.text())
  .then(data => {
    this.certificateContent = data;
    this.userHtml = data;
  	// Do something with your data
  	console.log(data);
  });
   
      
   
  //  this.isPreview = true;
  //  localStorage.setItem('isPreview', 'yes');
  }

  editTemplate()
  {
    this.isPreview = true; 
  }

  ngAfterViewInit() {
    /*const iframe: HTMLIFrameElement = document.getElementById('frame') as HTMLIFrameElement;

    iframe.contentWindow.addEventListener('mouseup', Handler);
    let _self = this;
    function Handler() {
      _self.dataChange();
      localStorage.setItem('isPreview', 'yes');
      localStorage.setItem('iframe', iframe.src);
    }*/
  }

  stringToHTML(str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
  };

  getDocument() {
    let payout = {
      "filters": {}
  }

    this.generalService.postData('DocumentType/search', payout).subscribe((res) => {
      console.log(res);
      this.documentTypeList =  res;
      this.selectedDecType = res;
    });
  }

  onChange(index) {
    console.log(index);
    this.selectedDecType = [];
    this.selectedDecType = [this.documentTypeList[index]];

    // const iframe: HTMLIFrameElement = document.getElementById('frame') as HTMLIFrameElement;
    // iframe.src = this.selectedDecType.samples[0].certificateUrl;

  }

   replaceAll(str, find, replace) {
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}

  submit() {
    console.log(this.description);
    console.log(this.userHtml);
     this.schemaContent = this.userJson;
   
  
    // Creating a file object with some content
    var fileObj = new File([this.userHtml], this.templateName.replace(/\s+/g, '') + '.html');
    console.log(fileObj);

  this.templateName = this.templateName.replace(/\s+/g, '');
      // Create form data
      const formData = new FormData(); 
      // Store form name as "file" with file data
      formData.append("files", fileObj, fileObj.name);
      this.generalService.postData('/Issuer/' + this.issuerOsid + '/schema/documents', formData).subscribe((res)=>{
      
        console.log( this.schemaContent);
        this.schemaContent = JSON.parse(this.schemaContent);
        let _self = this;
        Object.keys(this.schemaContent['properties']).forEach(function (key) {
          _self.oldTemplateName = key;
          console.log(key);
        });


        this.schemaContent._osConfig['certificateTemplates'] = { html :  'did:path:' + res.documentLocations[0]}

        let result = JSON.stringify(this.schemaContent);
        
       result = this.replaceAll(result, this.oldTemplateName, this.templateName);

        console.log({result});

        let payload = {
          "name": this.templateName,
          "schema": result
      }

        if(res.documentLocations[0])
        {
          this.generalService.postData('/Schema', payload).subscribe((res)=>{
            localStorage.setItem('content' , '');
            this.router.navigate(['/dashboard']);
          })
        }
      })

    
        
      // Make http post request over api
      // with formData as req
      // this.http.post(this.baseApiUrl, formData)
  

    // Verifying the contents of the file
    // var reader = new FileReader();
    // reader.onload = () => {
    //   console.log('reader', reader.result);
    // }
    // reader.readAsText(fileObj);

    // var a = document.createElement('a');
    // a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(this.userHtml));
    // a.setAttribute('download', 'cer.html');
    // a.click()

    //     var fso = new ActiveXObject("Scripting.FileSystemObject");
    // var a = fso.CreateTextFile("c:\\testfile.txt", true);
    // a.WriteLine("This is a test.");
    // a.Close();

  }
 

}
