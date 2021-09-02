import { Component, Input, NgModule } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'formly-field-file',
  template: `
    <input type="file" id="file" class="custom-file-upload"
    [multiple]="to.multiple"
    (change)="fileChanged($event)"/>
    <label style="color:{{color}}" for="file" ><i class="{{icon}}" aria-hidden="true"></i> {{lable}}</label>
    `,
})


export class FormlyFieldFile extends FieldType {
  data: any;
  fileName = '';
  lable = 'Upload File';
  color = 'blue'
  icon = 'fa fa-plus'

  constructor(public generalService: GeneralService) {
    super();
  }


  fileChanged(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.lable = 'Uploading ' + file.name
      this.color = 'orange';
      this.icon = 'fa fa-clock-o';
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("files", file);
      var url = ['', localStorage.getItem('entity'), localStorage.getItem('osid'), localStorage.getItem('property'), 'documents']
      this.generalService.postData(url.join('/'), formData).subscribe((res) => {
        console.log('res', res);
        this.lable = file.name
        this.color = 'green';
        this.icon = 'fa fa-check-circle'
      }, (err) => {
        this.lable = 'Something went wrong with ' + file.name
        console.log('error2', err.error.params.errmsg)
      });
    }

    // if (event.target.files && event.target.files[0]) {
    //   var filesAmount = event.target.files.length;
    //   for (let i = 0; i < filesAmount; i++) {
    //     var reader = new FileReader();

    //     reader.onload = (event: any) => {
    //       console.log(event.target.result);
    //       this.data = event.target.result;
    //       console.log(this.formControl);
    //       console.log(this.field.templateOptions);
    //       this.formControl.patchValue(event.target.result)
    //       console.log('1', this.data);
    //       var formData: FormData = new FormData();

    //       formData.append('files', this.data);
    //       console.log('Form Data', formData);
    //       var url = ['', localStorage.getItem('entity'), localStorage.getItem('osid'), localStorage.getItem('property'), 'documents']
    //       this.generalService.postData(url.join('/'), formData).subscribe((res) => {
    //         console.log('res', res)
    //         // if (res.params.status == 'SUCCESSFUL') {
    //         //   console.log('res Success', res.params.status)
    //         //   // this.router.navigate([this.redirectTo])
    //         // }
    //         // else if (res.params.errmsg != '' && res.params.status == 'UNSUCCESSFUL') {
    //         //   console.log('error', res.params.errmsg)
    //         // }
    //       }, (err) => {
    //         console.log('error2', err.error.params.errmsg)
    //       });
    //     }
    //     reader.readAsDataURL(event.target.files[i]);
    //     // this.data = event.target.result;

    //   }

    // }
  }

}