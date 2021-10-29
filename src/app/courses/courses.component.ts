import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from "json-schema";
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  schema: JSONSchema7 = {
    "title": "Issue Certificate",
    "type": "object",
    "required": [
      "course"
    ],
    "properties": {
      "course": {
        "type": "string",
        "title": "Course Name"
      },
      "type": {
        "type": "string",
        "title": "Certification Type",
        "enum": [
          "Attendance",
          "Merit"
        ]
      }
    }
  };
  form2: FormGroup;
  model = {};
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];
  student = false;
  institute = false;
  course;
  entity;
  enrolled;
  constructor(private formlyJsonschema: FormlyJsonschema,private route: ActivatedRoute,public router: Router,) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
      if(params['entity'] === 'Student'){
        this.entity = params['entity']
        this.student = true;
      }
      if(params['entity'] === 'institute'){
        this.entity = params['entity']
        this.institute = true;
      }
    });
    this.course = JSON.parse(localStorage.getItem('course'));
    this.enrolled = localStorage.getItem('enrolled');
    console.log(this.course);
    this.form2 = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];
  }

  submit(){
    // alert(this.model)
    localStorage.setItem('course',JSON.stringify(this.model));
    window.location.reload();
  }

  close(){
    console.log('here')
    this.router.navigate(['profile',this.entity]);
  }

  enroll(){
    localStorage.setItem('enrolled','true');
    window.location.reload();
  }

}
