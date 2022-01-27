import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SchemaService } from '../services/data/schema.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  page: any;
  pageSchema: any;
  myTemplate: any;
  notFound: any;
  title: any;

  constructor(private route: ActivatedRoute,public router: Router, public schemaService: SchemaService,private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['page'] != undefined) {
        this.page = params['page'];
      }
    });

    this.schemaService.getPageJSON().subscribe((PageSchemas) => {
      try{
        var filtered = PageSchemas.pages.filter(obj => {
          return Object.keys(obj)[0] === this.page
        })
        this.pageSchema = filtered[0][this.page]
        console.log(this.pageSchema)
        this.title = this.pageSchema.title;
        this.checkHtmlFile(this.pageSchema.path).subscribe((res) => {
          if (res) {
            this.myTemplate = res;
          }else{
            this.notFound = true;
          }
        },
          (error) => {
            this.notFound = true;
            var handler = document.getElementById('menu-open-handler');
            var toggleInterval = setInterval(function () {
              this.checkbox = document.getElementById('menu-open');
              this.checkbox.checked = !this.checkbox.checked;
            }, 4000);
    
            handler.onclick = function () {
              clearInterval(toggleInterval);
            };
          }
        );
      }
      catch (e) {
        this.notFound = true;
      }
    })
  }

  checkHtmlFile(path): Observable<any> {
    return this.httpClient.get(path,{responseType:'text'})
      .pipe(
        map((html: any) => {
          // console.log('html',html);
          return html;
        }),
        catchError(error => {
          console.log(error);
          this.notFound = true;
          return of(false);
        })
      );
  }

  close(){
    this.router.navigate(['']);
  }

}
