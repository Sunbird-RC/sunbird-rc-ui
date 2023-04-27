import { Component, ViewEncapsulation } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-template-type',
  styleUrls: ["../forms.component.scss"],
  template: `
    <div [innerHTML]="to.label"></div>
  `,
  encapsulation: ViewEncapsulation.None 
})
export class FormlyTemplateType extends FieldType {
  get labelProp(): string { return this.to.labelProp || 'label'; }
}
