import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-multicheckbox',
  styleUrls: [],
  template: `
  <span class="fw-bold p12">{{ to.label }} <span [hidden]="!to?.required" class="red"> * </span></span> <br>
  
  <ul class="{{field?.fieldGroupClassName}} mt-2 checkbox-list-style">
  <div [hidden]="!to?.setSelectAll">
  <input type="checkbox" class="form-check-input fs-12" [checked]="allChecked" (change)="setAll($event.checked)"> 
  <label class="form-check-label fs-12 pt-1 selectAllCss">  All {{ to.label }} </label>
  </div>
  <li *ngFor="let option of to.options; let i = index" class="{{field?.className}} list-unstyled remove-ul-style mt-1">
  <input 
  type="checkbox"
  [id]="id + '_' + i"
  class="form-check-input"
  [value]="option.value"
  [checked]="isChecked(option)"
  [formlyAttributes]="field"
  [disabled]="formControl.disabled || option.disabled"
  (change)="onChange(option.value, $any($event.target).checked)"
/>
<label class="form-check-label fs-12 pl-1" [for]="id + '_' + i">
  {{ option.label }}
</label>
  
  
</li>
</ul>
  
  `,
})
export class FormlyFieldMultiCheckbox extends FieldType {
  ngOnInit(): void {
    if (this.formControl.value) {
      if (Object.keys(this.formControl.value).length == Object.keys(this.to.options).length) {
        this.setAll(true);
      }
    }
  }
  allChecked = false;
  onChange(value: string | number | symbol, checked: boolean) {
    this.allChecked = false;
    this.formControl.markAsDirty();
    if (this.to.formate === 'array') {
      this.formControl.patchValue(
        checked
          ? [...new Set(this.formControl.value || []), value]
          : [...new Set(this.formControl.value || [])].filter((o) => o !== value),
      );
    } else {
      this.formControl.patchValue({ ...new Set(this.formControl.value), [value]: checked });
    }
    this.formControl.markAsTouched();
    if (Object.keys(this.formControl.value).length == Object.keys(this.to.options).length) {
      this.setAll(true);
    }
  }

  isChecked(option) {
    const value = this.formControl.value;
    return value && (this.to.formate === 'array' ? value.indexOf(option.value) !== -1 : value[option.value]);
  }

  setAll(checked) {
    this.allChecked = !this.allChecked;

    this.to.options.forEach(key => {

      if (this.to.formate === 'array') {
        this.formControl.patchValue(
          this.allChecked
            ? [...new Set(this.formControl.value || []), key['value']]
            : [...new Set(this.formControl.value || [])].filter((o) => o !== key['value']),
        );
      } else {
        this.formControl.patchValue({ ...new Set(this.formControl.value), [key['value']]: this.allChecked });
      }

    })
  }
}
