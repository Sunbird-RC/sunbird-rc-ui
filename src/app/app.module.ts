import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { APP_INITIALIZER } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPaginationModule} from 'ngx-pagination';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
// formly
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { ArrayTypeComponent } from '../app/forms/types/array.type';
import { ObjectTypeComponent } from '../app/forms/types/object.type';
import { MultiSchemaTypeComponent } from '../app/forms/types/multischema.type';
import { NullTypeComponent } from '../app/forms/types/null.type';
import { AutocompleteTypeComponent } from '../app/forms/types/autocomplete.type';
import { initializeKeycloak } from './utility/app.init';

//Local imports
import { FormsComponent } from './forms/forms.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { ModalRouterEditLinkDirective } from '../app/layouts/modal/modal.directive';
import { ModalRouterAddLinkDirective } from '../app/layouts/modal/modal.directive';
import { PanelsComponent } from './layouts/modal/panels/panels.component';
import { EditPanelComponent } from './layouts/modal/panels/edit-panel/edit-panel.component';
import { AddPanelComponent } from './layouts/modal/panels/add-panel/add-panel.component';
import { TablesComponent } from './tables/tables.component';
import { HeaderComponent } from './header/header.component';
import { FormlyFieldFile } from './forms/types/file.type';
import { FileValueAccessor } from './forms/types/file-value-accessor';
import { DocViewComponent } from './layouts/doc-view/doc-view.component';
import { FormlyFieldNgSelect } from './forms/types/multiselect.type';
import { Bootstrap4FrameworkModule } from 'angular6-json-schema-form';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AttestationComponent } from './tables/attestation/attestation.component';
import { InstallComponent } from './install/install.component';
import { HomeComponent } from './home/home.component';
import { FormlyHorizontalWrapper } from './forms/types/horizontal.wrapper';
import { AppConfig } from './app.config';
import { PanelWrapperComponent } from './forms/types/group.type';
import { LogoutComponent } from './authentication/logout/logout.component';
import { SearchComponent } from '../app/discovery/search/search.component';
import { AuthConfigService } from './authentication/auth-config.service';
import { DocumentsComponent } from './documents/documents.component';
import { AddDocumentComponent } from './documents/add-document/add-document.component';
import {WebcamModule} from 'ngx-webcam';
import { ScanDocumentComponent } from './documents/scan-document/scan-document.component';

//form validations
export function minItemsValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT have fewer than ${field.templateOptions.minItems} items`;
}

export function maxItemsValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT have more than ${field.templateOptions.maxItems} items`;
}

export function minlengthValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT be shorter than ${field.templateOptions.minLength} characters`;
}

export function maxlengthValidationMessage(err, field: FormlyFieldConfig) {
  return `should NOT be longer than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessage(err, field: FormlyFieldConfig) {
  return `should be >= ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field: FormlyFieldConfig) {
  return `should be <= ${field.templateOptions.max}`;
}

export function multipleOfValidationMessage(err, field: FormlyFieldConfig) {
  return `should be multiple of ${field.templateOptions.step}`;
}

export function exclusiveMinimumValidationMessage(err, field: FormlyFieldConfig) {
  return `should be > ${field.templateOptions.step}`;
}

export function exclusiveMaximumValidationMessage(err, field: FormlyFieldConfig) {
  return `should be < ${field.templateOptions.step}`;
}

export function constValidationMessage(err, field: FormlyFieldConfig) {
  return `should be equal to constant "${field.templateOptions.const}"`;
}

function initConfig(config: AppConfig){
  return () => config.load()
}

@NgModule({
  declarations: [
    AppComponent,
    FormsComponent,
    SearchComponent,
    ArrayTypeComponent,
    ObjectTypeComponent,
    MultiSchemaTypeComponent,
    NullTypeComponent,
    LayoutsComponent,
    ModalRouterEditLinkDirective,
    ModalRouterAddLinkDirective,
    PanelsComponent, EditPanelComponent, AddPanelComponent, TablesComponent,
    AutocompleteTypeComponent,
    HeaderComponent,
    AttestationComponent,
    FileValueAccessor,
    FormlyFieldFile,
    DocViewComponent,
    FormlyFieldNgSelect,
    InstallComponent,
    HomeComponent,
    LogoutComponent,
    DocumentsComponent,
    AddDocumentComponent,
    ScanDocumentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FormlyBootstrapModule,
    KeycloakAngularModule,
    NgxDocViewerModule,
    Bootstrap4FrameworkModule,
    AngularMultiSelectModule,
    NgSelectModule,
    WebcamModule,
    FormlyModule.forRoot({
      extras: { resetFieldOnHide: true },
      wrappers: [{ name: 'form-field-horizontal', component: FormlyHorizontalWrapper },
      { name: 'panel', component: PanelWrapperComponent }],
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        
      ],
      types: [
        { name: 'string', extends: 'input' },
        {
          name: 'number',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number',
            },
          },
        },
        {
          name: 'integer',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number',
            },
          },
        },
        { name: 'boolean', extends: 'checkbox' },
        { name: 'enum', extends: 'select' },
        { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
        { name: 'array', component: ArrayTypeComponent },
        { name: 'object', component: ObjectTypeComponent },
        { name: 'multischema', component: MultiSchemaTypeComponent },
        {
          name: 'autocomplete',
          component: AutocompleteTypeComponent
        },
        { name: 'file', component: FormlyFieldFile, wrappers: ['form-field'] },
        { name: 'multiselect', component: FormlyFieldNgSelect }
      ],
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-full-width',
    preventDuplicates: true,
    }),
    NgxPaginationModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [],
  bootstrap: [AppComponent],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true },
    {
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService,AuthConfigService],
  },
  { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } }]
})
export class AppModule {
  
}
