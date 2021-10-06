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
      key: 'configFolder',
      type: 'input',
      defaultValue: '/assets/config',
      templateOptions: {
        addonLeft: {
          text: 'configFolder:',
        },
        required: true,
        label: 'Read config files(forms.json,etc.) from which folder?',
      },
    },
    {
      key: 'logoPath',
      type: 'input',
      defaultValue: '/assets/images/logo.png',
      templateOptions: {
        addonLeft: {
          text: 'logoPath:',
        },
        required: true,
        label: 'what is the path of logo file?',
      },
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
