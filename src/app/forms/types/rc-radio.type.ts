import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

import { FormControl } from '@angular/forms';



@Component({
  selector: 'formly-field-radiobutton',
  styleUrls: ["../forms.component.scss"],
  template: `
 
    <span class="fw-bold p12">{{ to.label }}</span> <br>
    <div [ngClass]="to.layout == 'inline' ? 'd-flex mt-1 mb-3 ' : 'mt-1 mb-3'">
    <div  *ngFor="let option of to.options ; let i = index"  class="form-check me-4 ms-2">
    <input
          type="radio"
          [id]="id + '_' + i"
          class="form-check-input"
          [name]="field.name || id"
          [class.is-invalid]="showError"
          [attr.value]="option.value"
          [value]="option.value"
          [formControl]=" formControl"
          [formlyAttributes]="field"
        />
        <label class="form-check-label p12" [for]="id + '_' + i">

        {{ option.label }}
        </label>
        </div>
        </div>
  `,
})
export class FormlyFieldNgRadioButton extends FieldType {
  ngOnInit(): void { }
  
}
