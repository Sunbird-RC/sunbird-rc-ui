import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  scannerEnabled;
success : boolean = false;
qrString;
  items = [
    { "title" : "Student Name	",
    "value": "Paras Patel"
    },
    { "title" : "Course",
    "value": "Welding"
    },
    { "title" : "Certificate Type",
    "value": "Attendance"
    },
    { "title" : "Awarded On	",
    "value": "25 Oct 2021"
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

  enableScanner()
  {
    this.scannerEnabled = !this.scannerEnabled;

  }

  public scanSuccessHandler($event: any) {
    this.scannerEnabled = false;
    this.success = true;

    this.qrString = $event;
  console.log($event);
  }

}
