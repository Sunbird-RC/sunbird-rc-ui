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
  sampleData: any;
  constructor(public schemaService: SchemaService,
    public toastMsg: ToastMessageService,
    public router: Router,
    private route: ActivatedRoute,
    private formlyJsonschema: FormlyJsonschema,
    public generalService: GeneralService,
    public http: HttpClient) { }

  ngOnInit(): void {

    this.getDocument();

    // this.route.params.subscribe(params => {
    //   console.log(params);
    //   if (params['form'] != undefined) {
    //     this.form = params['form'].split('/', 1)[0];
    //   }
    // });


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
    localStorage.setItem('content', '');
  }

  previewScreen(doc) {
    console.log({ doc });
    this.sampleData = doc;


    fetch(doc.schemaUrl)
      .then(response => response.text())
      .then(data => {
        this.schemaContent = data;
        this.userJson = data;
        // Do something with your data
        console.log(this.userJson);
      });

    fetch(doc.certificateUrl)
      .then(response => response.text())
      .then(data => {
        this.certificateContent = data;
        this.userHtml = data;
        this.injectHTML();
      });



    //  this.isPreview = true;
    //  localStorage.setItem('isPreview', 'yes');
  }

  editTemplate() {
    localStorage.setItem('sampleData', JSON.stringify(this.sampleData));
   this.router.navigate(['/preview-html'], { state: { item: this.sampleData } });
  }


  getDocument() {
    let payout = {
      "filters": {}
    }

    this.generalService.postData('DocumentType/search', payout).subscribe((res) => {
      console.log(res);
      this.documentTypeList = res;
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

  injectHTML() {

    setTimeout(() => {
      const iframe: HTMLIFrameElement = document.getElementById('iframe1') as HTMLIFrameElement;
      var iframedoc;

      if (iframe.contentDocument) {
        iframedoc = iframe.contentDocument;
      }
      else if (iframe.contentWindow) {
        iframedoc = iframe.contentWindow.document;
      }

      if (iframedoc) {
        // Put the content in the iframe
        iframedoc.open();
        iframedoc.writeln(this.userHtml);
        iframedoc.close();
      } else {
        alert('Cannot inject dynamic contents into iframe.');
      }
    }, 500)
  }


}
