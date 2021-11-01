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
    "type": "object",
    "required": [
      "course"
    ],
    "properties": {
      "course": {
        "type": "string",
        "title": "Course Name"
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
  catagory;
  skill: any;
  constructor(private formlyJsonschema: FormlyJsonschema,private route: ActivatedRoute,public router: Router,) { }

  ngOnInit(): void {
    console.log("this.router.url",this.router.url)
    if(this.router.url === '/institute/courses' || this.router.url === '/Institute/courses'){
      this.catagory = 'course'
    }
    else if(this.router.url === '/institute/skills' || this.router.url === '/Institute/skills'){
      this.catagory = 'skill';
      this.schema.properties['course']['title'] = "Skill Name"
    }else{
      this.catagory = 'course';
    }
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
    if(this.catagory === 'course'){
      this.course = JSON.parse(localStorage.getItem('course'));
      this.enrolled = localStorage.getItem('enrolled');
      console.log(this.course);
    }
    if(this.catagory === 'skill'){
      this.skill = JSON.parse(localStorage.getItem('skill'));
    }
    this.form2 = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];
  }

  submit(){
    // alert(this.model)
    if(this.catagory === 'course'){
      localStorage.setItem('course',JSON.stringify(this.model));
    }
    if(this.catagory === 'skill'){
      localStorage.setItem('skill',JSON.stringify(this.model));
    }

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
