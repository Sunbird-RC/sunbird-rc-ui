import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  layout : string = 'mydoc';

  items = [
    {},{},{}
  ]

  constructor(private route: ActivatedRoute) {
  
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params);
      this.layout = params.layout;
    });
  }

}
