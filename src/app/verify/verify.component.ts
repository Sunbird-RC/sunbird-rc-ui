import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  scannerEnabled
  constructor() { }

  ngOnInit(): void {
  }

  enableScanner()
  {
    this.scannerEnabled = !this.scannerEnabled;

  }

  public scanSuccessHandler($event: any) {
    this.scannerEnabled = false;
  console.log($event);
  }

}
