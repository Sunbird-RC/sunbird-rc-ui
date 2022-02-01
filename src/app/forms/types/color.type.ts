import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
 selector: 'formly-field-input',
 template: `
 <input [(colorPicker)]="color" [style.background]="color" 
  (colorPickerChange)="test($event)"
[value]="color"
  />

 `,                                                                                                                 
})  
export class FormlyColorInput extends FieldType {
    public color: string = '#FFFFFF';
  test(event){
    this.formControl.patchValue(event);
    // this.field.model[this.key] = event;

  }

}