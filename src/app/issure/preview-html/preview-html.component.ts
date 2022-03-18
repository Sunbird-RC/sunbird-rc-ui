import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyARecord } from 'dns';
import { map } from 'rxjs/operators';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'app-preview-html',
  templateUrl: './preview-html.component.html',
  styleUrls: ['./preview-html.component.scss']
})
export class PreviewHtmlComponent implements OnInit {
  sampleData: any;
  schemaContent: any;
  userJson: string;
  userHtml: string;
  templateName: any;
  issuerOsid: string;
  oldTemplateName: string;
  description: any;

  constructor(public router: Router, public route: ActivatedRoute,
    public generalService: GeneralService) {

    if (localStorage.getItem('sampleData')) {
      this.sampleData = JSON.parse(localStorage.getItem('sampleData'));
    } else {
      this.sampleData = this.router.getCurrentNavigation().extras.state.item;
      localStorage.setItem('sampleData', JSON.stringify(this.sampleData));
    }

    this.generalService.getData('/Issuer').subscribe((res) => {
      console.log(res);
      this.issuerOsid = res[0].osid;
    });
    
    console.log(this.sampleData);
    this.readHtmlSchemaContent(this.sampleData);
  }

  ngOnInit(): void {
  }

  dataChange() {
    window.location.reload();
  }

  cancel() {
    // this.isPreview = false;
    localStorage.setItem('sampleData', '');
    this.router.navigate(['/dashboard']);
    }

  readHtmlSchemaContent(doc) {



    fetch(doc.schemaUrl)
      .then(response => response.text())
      .then(data => {
        this.schemaContent = data;
        this.userJson = data;
      });

    fetch(doc.certificateUrl)
      .then(response => response.text())
      .then(data => {
        this.userHtml = data;
        this.injectHTML();
        // Do something with your data
        console.log(data);
      });
  }

  stringToHTML(str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
  };


  replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
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
    this.generalService.postData('/Issuer/' + this.issuerOsid + '/schema/documents', formData).subscribe((res) => {

      console.log(this.schemaContent);
      this.schemaContent = JSON.parse(this.schemaContent);
      let _self = this;
      Object.keys(this.schemaContent['properties']).forEach(function (key) {
        _self.oldTemplateName = key;
        console.log(key);
      });


      this.schemaContent._osConfig['certificateTemplates'] = { html: 'did:path:' + res.documentLocations[0] }

      let result = JSON.stringify(this.schemaContent);

      result = this.replaceAll(result, this.oldTemplateName, this.templateName);

      console.log({ result });

      let payload = {
        "name": this.templateName,
        "schema": result
      }

      if (res.documentLocations[0]) {
        this.generalService.postData('/Schema', payload).subscribe((res) => {
          localStorage.setItem('content', '');
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

  injectHTML() {

    const iframe: HTMLIFrameElement = document.getElementById('iframe2') as HTMLIFrameElement;


    // step 2: obtain the document associated with the iframe tag
    // most of the browser supports .document. 
    // Some supports (such as the NetScape series) .contentDocumet, 
    // while some (e.g. IE5/6) supports .contentWindow.document
    // we try to read whatever that exists.

    var iframedoc;
    if (iframe.contentDocument)
      iframedoc = iframe.contentDocument;
    else if (iframe.contentWindow)
      iframedoc = iframe.contentWindow.document;


    if (iframedoc) {
      // Put the content in the iframe
      iframedoc.open();
      iframedoc.writeln(this.userHtml);
      iframedoc.close();
    } else {
      alert('Cannot inject dynamic contents into iframe.');
    }
  }

 

 


}

