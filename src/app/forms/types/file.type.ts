import { Component, ElementRef, Input, NgModule, ViewChild } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { GeneralService } from 'src/app/services/general/general.service';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'formly-field-file',
  styleUrls: ["../forms.component.scss"],
  template: `
      <div>
      <div (click)="openFileInput()">
        <div></div>
          
           <label class="p12 text-primary-color"> {{'UPLOAD_FILE' | translate}} </label>
          
        <input
          #fileinput
          [multiple]="to.multiple"
          id="file-input"
          type="file"
          [formControl]="formControl"
          [formlyAttributes]="field"
          (change)="onChange($event)"
          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx,.xml,.json"
          style="visibility: hidden;"
        />
      </div>
      <div>
    </div>
    </div>
    <div *ngFor="let file of selectedFiles; let i = index">
        <span class="badge badge-pill badge-primary"><i class="fa fa-paperclip" aria-hidden="true"></i> {{ file.name }}</span>
      </div>
    `,
})


export class FormlyFieldFile extends FieldType {
  data: any;
  fileName = '';
  lable = '+ Upload File';
  color = 'blue'
  icon = 'fa fa-plus'
  @ViewChild("fileinput") el: ElementRef;
  selectedFiles: File[];
  constructor(public sanitizer: DomSanitizer) {
    super();
  }
  ngOnInit(): void {}
  openFileInput() {
    this.el.nativeElement.click();
  }

  //    this.uploadLAbel = this.generalService.translateString(generalService);

  onDelete(index) {
    // this.formControl.reset();
    console.log(this.selectedFiles);
    this.selectedFiles.splice(index, 1);

    this.formControl.patchValue(this.selectedFiles);
    console.log("Form Control Value", this.formControl.value);
  }
  onChange(event) {
    this.selectedFiles = Array.from(event.target.files);
    console.log(this.selectedFiles);
  }
  getSanitizedImageUrl(file: File) {
    return this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(file)
    );
  }
  isImage(file: File): boolean {
    return /^image\//.test(file.type);
  }

  fileChanged(event: any) {
  //   const file: File = event.target.files[0];

  //   if (file) {
  //     this.lable = 'Uploading ' + file.name
  //     this.color = 'orange';
  //     this.icon = 'fa fa-clock-o';
  //     this.fileName = file.name;
  //     const formData = new FormData();
  //     formData.append("files", file);
  //     var url = ['', localStorage.getItem('entity'), localStorage.getItem('osid'), localStorage.getItem('property'), 'documents']
  //     this.generalService.postData(url.join('/'), formData).subscribe((res) => {
  //       console.log('res', res);
  //       var documents = [];
  //       var documents_obj = {
  //         "fileName": "",
  //         "format": "file"
  //       }
  //       res.documentLocations.forEach(element => {
  //         documents_obj.fileName = element;
  //         documents.push(documents_obj);
  //       });
  //       localStorage.setItem('documents', JSON.stringify(documents));
  //       this.lable = file.name
  //       this.color = 'green';
  //       this.icon = 'fa fa-check-circle'
  //     }, (err) => {
  //       this.lable = 'Something went wrong with ' + file.name
  //     });
  //   }

  //   // if (event.target.files && event.target.files[0]) {
  //   //   var filesAmount = event.target.files.length;
  //   //   for (let i = 0; i < filesAmount; i++) {
  //   //     var reader = new FileReader();
  //   //     reader.onload = (event: any) => {
  //   //       console.log(event.target.result);
  //   //       this.data = event.target.result;
  //   //       console.log(this.formControl);
  //   //       console.log(this.field.templateOptions);
  //   //       this.formControl.patchValue(event.target.result)
  //   //       console.log('1', this.data);
  //   //       var formData: FormData = new FormData();

  //   //       formData.append('files', this.data);
  //   //       console.log('Form Data', formData);
  //   //       var url = ['', localStorage.getItem('entity'), localStorage.getItem('osid'), localStorage.getItem('property'), 'documents']
  //   //       this.generalService.postData(url.join('/'), formData).subscribe((res) => {
  //   //         console.log('res', res)
  //   //         // if (res.params.status == 'SUCCESSFUL') {
  //   //         //   console.log('res Success', res.params.status)
  //   //         //   // this.router.navigate([this.redirectTo])
  //   //         // }
  //   //         // else if (res.params.errmsg != '' && res.params.status == 'UNSUCCESSFUL') {
  //   //         //   console.log('error', res.params.errmsg)
  //   //         // }
  //   //       }, (err) => {
  //   //         console.log('error2', err.error.params.errmsg)
  //   //       });
  //   //     }
  //   //     reader.readAsDataURL(event.target.files[i]);
  //   //     // this.data = event.target.result;

  //   //   }

  //   // }
  }
}
  

  // constructor(public generalService: GeneralService) {
  //   super();
  // }


 

// }
