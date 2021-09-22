import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ng-select',
  template: `
    <ng-select [items]="to.options"
      [bindLabel]="labelProp"
      [bindValue]="valueProp"
      [multiple]="to.multiple"
      [placeholder]="to.placeholder"
      [formControl]="formControl">
    </ng-select>
  `,
})
export class FormlyFieldNgSelect extends FieldType {
  get labelProp(): string { return this.to.labelProp || 'label'; }
  get valueProp(): string { return this.to.valueProp || 'value'; }
  get groupProp(): string { return this.to.groupProp || 'group'; }
}