import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-stepper',
  template: `

    <mat-horizontal-stepper labelPosition="{{field?.templateOptions?.stepperConfig?.stepslabelPosition}}">
      <mat-step [stepControl]="step" state="{{step.templateOptions?.config?.stepIcon}}" *ngFor="let step of field.fieldGroup; let index = index; let last = last">
      <ng-template matStepLabel>
      {{ step.templateOptions.label }} 
    </ng-template>
                                                                                   
         <formly-field [field]="step"></formly-field>
       
           <div class=" d-inline">
              <div *ngFor="let buttonL of step.templateOptions?.config?.button" class=" d-inline">
        
                <button matStepperPrevious  *ngIf="index !== 0 && buttonL?.actionType == 'back'" [ngClass]=" buttonL?.class ? 'btn  btn-outline-primary mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" type="button">{{ buttonL?.title}}</button>
            
                <button matStepperPrevious *ngIf="buttonL?.actionType == 'cancel'" [ngClass]=" buttonL?.class ? 'btn mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" type="button">{{ buttonL?.title}}</button>

                <button matStepperNext  *ngIf="!last && buttonL?.actionType == 'next'" [ngClass]=" buttonL?.class ? 'btn mx-2 btn-outline-primary' + ' ' +  buttonL?.class : 'btn btn-primary mx-2'" type="button" [disabled]="!isValid(step)">{{ buttonL?.title}} </button>

                <button matStepperNext *ngIf="buttonL?.actionType == 'skip'" [ngClass]=" buttonL?.class ? 'btn mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" type="button">{{ buttonL?.title}}</button>

                <button *ngIf="last && buttonL?.actionType == 'submit'" [ngClass]=" buttonL?.class ? 'btn mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" [disabled]="!form.valid" type="submit">{{ buttonL?.title}}</button>

                <button *ngIf="buttonL?.actionType == 'action'" [ngClass]=" buttonL?.class ? 'btn mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" type="button" [disabled]="!form.valid"> {{ buttonL?.title}}</button>

              </div>
          </div>
         
      </mat-step>

    

    </mat-horizontal-stepper>
  `,
})
export class FormlyFieldStepper extends FieldType {


  isValid(field: FormlyFieldConfig): boolean {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup ? field.fieldGroup.every((f) => this.isValid(f)) : true;
  }
}
