import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyARecord } from 'dns';
import { map } from 'rxjs/operators';
import { GeneralService } from 'src/app/services/general/general.service';
declare var grapesjs: any;


import 'grapesjs-preset-webpage';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';


@Component({
  selector: 'app-preview-html',
  templateUrl: './preview-html.component.html',
  styleUrls: ['./preview-html.component.scss']
})
export class PreviewHtmlComponent implements OnInit {

  public editorOptions: JsonEditorOptions;
  public data: any;
  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;

  sampleData: any;
  schemaContent: any;
  userJson: any;
  userHtml: any = '';
  templateName: any;
  issuerOsid: string;
  oldTemplateName: string;
  description: any;

  private editor: any = '';

  demoBaseConfig: {
    width: number; height: number; resize: boolean; autosave_ask_before_unload: boolean; codesample_dialog_width: number; codesample_dialog_height: number; template_popup_width: number; template_popup_height: number; powerpaste_allow_local_images: boolean; plugins: string[]; //removed:  charmap insertdatetime print
    external_plugins: { mentions: string; }; templates: { title: string; description: string; content: string; }[]; toolbar: string; content_css: string[];
  };

  constructor(public router: Router, public route: ActivatedRoute,public toastMsg: ToastMessageService,
    public generalService: GeneralService) {

    this.editorOptions = new JsonEditorOptions()
    // this.editorOptions.modes = ['code']; // set all allowed modes

    this.editorOptions.mode = 'code';
    this.editorOptions.history = true;
   // this.editorOptions.onChange = () => console.log(this.jsonEditor.get());
   this.editorOptions.onChange = () => this.jsonEditor.get();

    this.userHtml = '';

    if (localStorage.getItem('sampleData')) {
      this.sampleData = JSON.parse(localStorage.getItem('sampleData'));
    } else {
      this.sampleData = this.router.getCurrentNavigation().extras.state.item;
      localStorage.setItem('sampleData', JSON.stringify(this.sampleData));
    }

    this.generalService.getData('/Issuer').subscribe((res) => {

      this.issuerOsid = res[0].osid;
    });
  }

  async ngOnInit() {
    this.userHtml = '';
    await this.readHtmlSchemaContent(this.sampleData);

    this.editor = this.initializeEditor();
    this.editor.on('load', () => {
      var panelManager = this.editor.Panels;

      panelManager.removePanel('devices-c');
      panelManager.removeButton('options', 'gjs-toggle-images');
      panelManager.removeButton('options', 'gjs-open-import-webpage');
      panelManager.removeButton('options', 'undo');


      const um = this.editor.UndoManager;
      um.clear();
    })

    this.editor.on('asset:add', () => {
      this.editor.runCommand('open-assets');
    });


    // This will execute once asset manager will be open
    this.editor.on("run:select-assets", function () {
      var dateNow = 'img-' + Date.now();

      // Using below line i am changing the id of img tag on which user has clicked.
      this.editor.getSelected().setId(dateNow);

      // Store active asset manager image id and it's src
      localStorage.setItem('activeAssetManagerImageId', dateNow);
    })

    const pn = this.editor.Panels;
    const panelViews = pn.addPanel({
      id: "views"
    });


    panelViews.get("buttons").add([
      {
        attributes: {
          title: "Open Code"
        },
        className: "fa fa-file-code-o pr-4",
        command: "open-code",
        togglable: false, //do not close when button is clicked again
        id: "open-code"
      }
    ]);

    const panelOp = pn.addPanel({
      id: "options"
    });

    panelOp.get("buttons").add([
      {
        attributes: {
          title: "preview"
        },
        className: "fa fa-eye",
        command: "preview",
        togglable: false, //do not close when button is clicked again
        id: "preview"
      }
    ]);


  }


  private initializeEditor(): any {

    console.log(this.userHtml);
    return grapesjs.init({
      // Indicate where to init the editor. You can also pass an HTMLElement
      container: '#gjs',
      // Get the content for the canvas directly from the element
      // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
      autorender: true,
      forceClass: false,
      height: '700px',
      width: 'auto',
      // components: '<h1> Hello </h1>',
      components: this.userHtml,
      // Avoid any default panel
      panels: { defaults: [] },
      deviceManager: {},
      storageManager: {},
      undoManager: {},
      plugins: [
        'gjs-preset-webpage',
        'grapesjs-component-code-editor',
        'gjs-preset-newsletter'
      ],
      pluginsOpts: {
        'gjs-preset-webpage': {
          navbarOpts: false,
          countdownOpts: false,
          formsOpts: false,
          blocksBasicOpts: {
            blocks: ['link-block', 'quote', 'column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
            // flexGrid: false,
          }
        },
        'gjs-preset-newsletter': {

        }

      },

      assetManager: {
        uploadText: 'Add image through link or upload image',
        modalTitle: 'Select Image',
        openAssetsOnDrop: 1,
        inputPlaceholder: 'http://url/to/the/image.jpg',
        addBtnText: 'Add image',
        showUrlInput: true,
        embedAsBase64: true,
        dropzone: 0, // Enable an upload dropzone on the entire editor (not document) when dragging files over it
        handleAdd: (textFromInput) => {
          this.editor.AssetManager.add(textFromInput);
        },
        assets: [
        ]
      }
    });
  }

  dataChange() {
    window.location.reload();
  }

  back() {
    history.back();    //this.router.navigate(['/certificate']);
    this.editor.runCommand('core:canvas-clear')
  }

  cancel() {
    // this.isPreview = false;
    localStorage.setItem('sampleData', '');
    this.router.navigate(['/dashboard']);
  }

  async readHtmlSchemaContent(doc) {

    this.userHtml = '';
    await fetch(doc.schemaUrl)
      .then(response => response.text())
      .then(data => {
        this.schemaContent = data;
        this.userJson = JSON.parse(data);
      });

    await fetch(doc.certificateUrl)
      .then(response => response.text())
      .then(data => {
        this.userHtml = data;

        //   this.injectHTML();
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
    this.schemaContent = this.jsonEditor.get();


    var htmlWithCss = this.editor.runCommand('gjs-get-inlined-html');


    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(htmlWithCss, 'text/html');
    this.userHtml = htmlDoc.documentElement.innerHTML

    // Creating a file object with some content
    var fileObj = new File([this.userHtml], this.templateName.replace(/\s+/g, '') + '.html');


    let str = this.templateName.replace(/\s+/g, '');
    this.templateName = str.charAt(0).toUpperCase() + str.slice(1)
    // Create form data
    const formData = new FormData();
    // Store form name as "file" with file data
    formData.append("files", fileObj, fileObj.name);
    this.generalService.postData('/Issuer/' + this.issuerOsid + '/schema/documents', formData).subscribe((res) => {

     // this.schemaContent = JSON.parse(this.schemaContent);
      let _self = this;
      Object.keys(this.schemaContent['properties']).forEach(function (key) {
        _self.oldTemplateName = key;
      });


      this.schemaContent._osConfig['certificateTemplates'] = { html: 'did:path:' + res.documentLocations[0] }

      let result = JSON.stringify(this.schemaContent);

      result = this.replaceAll(result, this.oldTemplateName, this.templateName);

      let payload = {
        "name": this.templateName,
        "description": this.description,
        "schema": result
      }

      if (res.documentLocations[0]) {
        this.generalService.postData('/Schema', payload).subscribe((res) => {
          localStorage.setItem('content', '');
          this.router.navigate(['/dashboard']);
        }, (err)=>{
          this.toastMsg.error('error', err.error.params.errmsg)

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

