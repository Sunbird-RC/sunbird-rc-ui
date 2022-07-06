import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyARecord } from 'dns';
import { map } from 'rxjs/operators';
import { GeneralService } from 'src/app/services/general/general.service';
declare var grapesjs: any;


import 'grapesjs-preset-webpage';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
import { SchemaService } from '../../services/data/schema.service';

@Component({
  selector: 'app-preview-html',
  templateUrl: './preview-html.component.html',
  styleUrls: ['./preview-html.component.scss']
})
export class PreviewHtmlComponent implements OnInit {

  public editorOptions: JsonEditorOptions;
  public data: any;
  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  name1: string = 'pratik';
  sampleData: any;
  schemaContent: any;
  userJson: any;
  userHtml: any = '';
  templateName: any;
  issuerOsid: string;
  oldTemplateName: string;
  description: any;

  private editor: any = '';
  schemaDiv = false;
  htmlDiv = true;

  demoBaseConfig: {
    width: number; height: number; resize: boolean; autosave_ask_before_unload: boolean; codesample_dialog_width: number; codesample_dialog_height: number; template_popup_width: number; template_popup_height: number; powerpaste_allow_local_images: boolean; plugins: string[]; //removed:  charmap insertdatetime print
    external_plugins: { mentions: string; }; templates: { title: string; description: string; content: string; }[]; toolbar: string; content_css: string[];
  };
  certificateTemplate: any;
  certificateProperties: any;
  certificateTitle: any;
  propertyArr : any = [];

  constructor(public router: Router, public route: ActivatedRoute, public toastMsg: ToastMessageService,
    public generalService: GeneralService, public schemaService: SchemaService) {

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

    await this.readHtmlSchemaContent(this.sampleData);
    this.grapesJSDefine();
    /* ------END-------------------------Advance Editor ----------------------- */

  }  //onInit();


  grapesJSDefine()
  {
    this.editor = this.initializeEditor();
    this.editor.on('load', () => {
      var panelManager = this.editor.Panels;

      panelManager.removePanel('devices-c');
      panelManager.removeButton('options', 'gjs-toggle-images');
      panelManager.removeButton('options', 'gjs-open-import-webpage');
      panelManager.removeButton('options', 'undo');


      // panelManager.removeButton("views", "open-layers");
      // panelManager.removeButton("views", "settings");
      //sw-visibility


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
        className: "fa fa-file-code-o",
        command: "open-code",
        togglable: false, //do not close when button is clicked again
        id: "open-code"
      }
    ]);


    const panelOp1 = pn.addPanel({
      id: "options"
    });

    panelOp1.get("buttons").add([
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


    /* ---------Start----------------------Advance Editor ----------------------- */


    const panelOp = pn.addPanel({
      id: "options"
    });


    let editPanel = null
    let self = this;
    pn.addButton('views', {
      id: 'advanceEditor',
      attributes: { class: 'fa fa-pencil-square-o', title: "Advance Editor" },
      active: false,
      togglable: false,
      command: {
        run: function (editor) {
          if (editPanel == null) {



            const editMenuDiv = document.createElement('div');

            const arr = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'alpha', 'bravo', 'charlie', 'delta', 'echo', 'alpha', 'bravo', 'charlie', 'delta', 'echo'];

            const cardDiv = document.createElement('div');
            cardDiv.className = 'pcard p-3';
            cardDiv.setAttribute('style', 'text-align: left; color:white');
            cardDiv.innerHTML = ` <div class="d-flex flex-justify-between px-2 py-2">
            <div class="heading-2">Preview</div>
            <div>
                <button id="advanceBtn" (click)="editTemplate()"
                    class="float-end adv-btn btn"><i
                        class="fa fa-pencil-square-o" aria-hidden="true"></i>Advance Editor</button>
            </div>
        </div>
        <p style="color:white;font-size:12px"> <i class="fa fa-asterisk" style="color: #FFD965; font-size: 7px;" aria-hidden="true"></i>
        These propeties are mandatory to make it <org> complaint</p>`;

            const cardBContainer = document.createElement('div');
            cardBContainer.className = 'card-body-container p-3';
            cardDiv.appendChild(cardBContainer);

            // ul.setAttribute('id', 'theList');
            for (let i = 0; i <= self.propertyArr.length - 1; i++) {
              const cardBdiv = document.createElement('div');	// create li element.

              if(self.propertyArr[i].require)
              {
                cardBdiv.innerHTML = `<i class="fa fa-asterisk" style="color: red; font-size: 7px;" aria-hidden="true"></i> &nbsp` + self.propertyArr[i].propertyTag;
              }else{
             cardBdiv.innerHTML = `&nbsp &nbsp` + self.propertyArr[i].propertyTag;	                        // assigning text to li using array value.
              }
              cardBdiv.className = 'pcard-body  mt-4';
              cardBdiv.setAttribute('style', 'padding-bottom: 10px; border-bottom: 2px solid #000');	// remove the bullets.
              cardBContainer.appendChild(cardBdiv);		// append li to ul.
            }



            editMenuDiv.appendChild(cardDiv);



            const panels = pn.getPanel('views-container')
            panels.set('appendContent', editMenuDiv).trigger('change:appendContent')
            editPanel = editMenuDiv;

            const urlInputElemen = document.getElementById('advanceBtn');
            urlInputElemen.onclick = function () {


              // here is where you put your ajax logic
              self.editTemplate();


            };
          }
          editPanel.style.display = 'block';



        },
        stop: function (editor) {
          if (editPanel != null) {
            editPanel.style.display = 'none'
          }
        }

      }
    })

  }

  editTemplate() {
    this.schemaDiv = true;
    this.htmlDiv = false;
  }

  private initializeEditor(): any {

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
      },
    });
  }

  dataChange() {
    window.location.reload();
  }

  back() {
    history.back();    //this.router.navigate(['/certificate']);
    this.editor.runCommand('core:canvas-clear')
  }

  backToHtmlEditor() {
    this.schemaDiv = false;
    this.htmlDiv = true;
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
        //    this.schemaContent = data;
        // console.log({ data });
        data = JSON.parse(data);
        this.certificateTitle = data['title'];
        this.userJson = data;
       this.addCrtTemplateFields(this.userJson);
       // this.certificateTemplate = this.userJson['_osConfig']['credentialTemplate'];
        this.getCrtTempFields(this.userJson);
      });

    await fetch(doc.certificateUrl)
      .then(response => response.text())
      .then(data => {
        this.userHtml = data;

        //   this.injectHTML();
      });
  }

 
  addCrtTemplateFields(userJson){
    let url = this.userJson['_osConfig']['credentialTemplate'];

    this.userHtml = '';
     fetch(url)
      .then(response => response.text())
      .then(data => {
        //    this.schemaContent = data;
        console.log({ data });
      });

  }

  getCrtTempFields(certificateSchema) {
    this.propertyArr = [];
    let temp =  certificateSchema.definitions[this.certificateTitle].properties;
    let required =  certificateSchema.definitions[this.certificateTitle].required;
    let _self = this;
    Object.keys(temp).forEach(function (key) {
      let propertyName = "{{credentialSubject." + key + "}}";
     let isRequire = required.includes(key) ? true : false;
      console.log(propertyName);
     _self.propertyArr.push({ 'propertyTag' : propertyName, 'require': isRequire});
    });

   this.grapesJSDefine();
    console.log(this.propertyArr);


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

  addCrtTemplateFields1() {
    let certTmpJson = (this.schemaContent) ? this.schemaContent : this.userJson;
    certTmpJson = certTmpJson['_osConfig']['credentialTemplate']['credentialSubject'];
    let _self = this;
    Object.keys(certTmpJson).forEach(function (key) {
      console.log({key});
    });

  }

  async submit() {
    // this.schemaContent = this.jsonEditor.get();//JSON.stringify(this.userJson);

    this.schemaContent = (this.schemaContent) ? this.schemaContent : this.userJson;
   // this.schemaContent = await this.addCrtTemplateFields();

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


      this.schemaContent._osConfig['certificateTemplates'] = { html: 'minio://' + res.documentLocations[0] }

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
        }, (err) => {
          console.log('err ----', err);
          // alert('error');
          this.toastMsg.error('error', err.error.params.errmsg)

        })
      }
    })

  }


  injectHTML() {

    const iframe: HTMLIFrameElement = document.getElementById('iframe2') as HTMLIFrameElement;

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

  jsonSchemaData(jsonSchema) {
    this.schemaContent = jsonSchema._data;
    this.getCrtTempFields(this.schemaContent);
    console.log(jsonSchema._data);
  }


}

