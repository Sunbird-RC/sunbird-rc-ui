import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.scss']
})
export class InstallComponent implements OnInit {
  installed: boolean = false;
  message: boolean = false;
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  languages = [
    { value: "en", label: 'English' },
    { value: "hi", label: 'Hindi'  }
  ]
  fields: FormlyFieldConfig[] = [
    {
      key: 'title',
      type: 'input',
      templateOptions: {
        placeholder: 'ex: Sunbird RC',
        required: true,
        addonLeft: {
          text: 'title:',
        },
        label: 'What is your project name?',
      },
    },
    {
      key: 'environment',
      type: 'select',
      defaultValue: 'development',
      templateOptions: {
        label: 'Select environment',
        required: true,
        addonLeft: {
          text: 'environment:',
        },
        options: [
          { label: 'Development', value: 'development' },
          { label: 'Production', value: 'production' }
        ],
      },
    },
    {
      key: 'appType',
      type: 'select',
      defaultValue: 'Attestation',
      templateOptions: {
        label: 'Select type of appplication',
        required: true,
        addonLeft: {
          text: 'appType:',
        },
        options: [
          { label: 'Attestation', value: 'attestation' },
          { label: 'Certification', value: 'certification' },
          { label: 'Digital Wallet', value: 'digital_wallet'}
        ],
      },
    },
    {
      key: 'baseUrl',
      type: 'input',
      templateOptions: {
        placeholder: 'ex: https://example.com/api/v1',
        required: true,
        addonLeft: {
          text: 'baseUrl:',
        },
        label: 'What is your base API URL?',
      },
    },
    {
      key: 'schemaUrl',
      type: 'input',
      templateOptions: {
        placeholder: 'ex: https://example.com/api/docs/schema.json',
        required: true,
        addonLeft: {
          text: 'schemaUrl:',
        },
        label: 'What is your schema URL?',
      },
    },
    {
      key: 'keycloak',
      wrappers: ['panel'],
      templateOptions: { label: 'Keycloak Configurations' },
      fieldGroup: [{
        key: 'url',
        type: 'input',
        templateOptions: {
          placeholder: 'ex: https://example.com/auth',
          required: true,
          type: 'text',
          label: 'Authentication service configurations',
          addonLeft: {
            text: 'url:',
          },
        },
      },
      {
        key: 'realm',
        type: 'input',
        templateOptions: {
          required: true,
          type: 'text',
          addonLeft: {
            text: 'realm:',
          },
        },
      },
      {
        key: 'clientId',
        type: 'input',
        templateOptions: {
          required: true,
          type: 'text',
          addonLeft: {
            text: 'clientId:',
          },
        },
      }
      ],
    },
    {
      key: 'language',
      type: 'select',
      templateOptions: {
        label: 'Select Default Language',
        placeholder: 'Select Default language',
        required: true,
        multiple: true,
        options: this.languages
      
      }
    },
    {
      key: 'configFolder',
      type: 'input',
      defaultValue: '/assets/config',
      templateOptions: {
        addonLeft: {
          text: 'configFolder:',
        },
        description:'Reference link : https://github.com/ref-registries/edu-core-registries/tree/main/ui-config',
        required: true,
        label: 'Read config files(forms.json,layouts.json,etc.) from which folder?',
      },
    },
    { 
      key: 'default_theme',
      wrappers: ['panel'],
      templateOptions: { label: 'Default Theme' },
      fieldGroup: [
        {
          key: 'logoPath',
          type: 'input',
          defaultValue: '/assets/images/default-logo.png',
          templateOptions: {
            addonLeft: {
              text: 'logoPath:',
            },
            required: true,
            label: 'what is the path of logo file?',
          },
        },
        {
          key: 'primaryColor',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Primary color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'secondaryColor',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Secondary color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'bodyBackground',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Body Backgroud color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'cardBackground',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Card Backgroud color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'tagsBackground',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Tags Backgroud color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'navLabelColor',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Navigation Lable color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'headerColor',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Header color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'primaryTextColor',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Primary Text color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'secondaryTextColor',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Secondary Text color:',
            },
            required: true,
            label: 'Select color',
          },
        }
      ]
    },
    { 
      key: 'dark_theme',
      wrappers: ['panel'],
      templateOptions: { label: 'Dark Theme' },
      fieldGroup: [
        {
          key: 'logoPath',
          type: 'input',
          defaultValue: '/assets/images/dark-logo.png',
          templateOptions: {
            addonLeft: {
              text: 'logoPath:',
            },
            required: true,
            label: 'what is the path of logo file?',
          },
        },
        {
          key: 'primaryColor',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Primary color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'secondaryColor',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Secondary color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'bodyBackground',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Body Backgroud color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'cardBackground',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Card Backgroud color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'tagsBackground',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Tags Backgroud color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'navLabelColor',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Navigation Lable color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'headerColor',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Header color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'primaryTextColor',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Primary Text color:',
            },
            required: true,
            label: 'Select color',
          },
        },
        {
          key: 'secondaryTextColor',
          type: 'color',
          defaultValue: '#000000',
          templateOptions: {
            addonLeft: {
              text: 'Secondary Text color:',
            },
            required: true,
            label: 'Select color',
          },
        }
      ]
    },
    {
      key: 'footerText',
      type: 'input',
      templateOptions: {
        defaultValue: 'Sunbird Registry and Credencials',
        required: true,
        addonLeft: {
          text: 'footerText:',
        },
        label: 'Text on footer',
      },
    },

  ];

  constructor(public router: Router, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.checkConfig().subscribe((res) => { if (res) { this.router.navigate(['']) } },
      (error) => this.installed = false);
  }

  checkConfig(): Observable<boolean> {
    return this.httpClient.get('/assets/config/config.json')
      .pipe(
        map(response => {
          console.log('response', response)
          this.installed = true;
          this.router.navigate([''])
          return true;
        }),
        catchError(error => {
          console.log('error', error)
          this.installed = false;
          return of(false);
        })
      );
  }
  async submit() {
    this.formateData()
    await this.saveConfig('config.json', JSON.stringify(this.model));
    this.installed = true;
  }

  saveConfig(filename, data) {
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(data));
    a.setAttribute('download', filename);
    a.click()
    this.message = true;
  }

  formateData() {
    if (this.model.baseUrl.substring(this.model.baseUrl.length - 1) == "/") {
      this.model.baseUrl = this.model.baseUrl.substring(0, this.model.baseUrl.length - 1);
    }
  }

}
