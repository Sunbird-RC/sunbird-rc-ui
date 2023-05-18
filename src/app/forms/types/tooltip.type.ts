import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'tooltip-code',
  styleUrls: [],
  styles: [
    `
.label{
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--secondaryTextColor);
}

.tooltip-text {
  display: none;
  background-color: #000;
  color: #fff;
  text-align: left;
  border-radius: 6px;
  position: absolute;
  padding: 3px;
  margin-left: 10px;
}

.tooltip-wrapper:hover + .tooltip-text {
  display: inline-block;
  position: absolute;
}

.tooltip-wrapper:hover + .tooltip-text::before {
  content: "";
  position: absolute;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid #000;
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
}

    `
  ],
  template: `
    <div >
        <label class="tooltip-wrapper label">{{ to.label }}
          <span *ngIf="to.required" class="red mr-1">*</span>
          <span><i class="fa fa-info-circle" style="color:#000;"></i></span>
        </label>
        
        <span class="tooltip-text">{{ to.tooltip }}</span>
        <input type="text" class="form-control" [formControl]="formControl" [formlyAttributes]="field" [title]="to.tooltip">
        <small class="form-text text-muted">{{ to.description }}</small>
        
        
    </div>  
`
})
export class TooltipWrapper extends FieldType {
  tooltipWrapper: any;
  tooltipText: any;
  get tooltipContent(): string {
    return this.to.tooltip;
  }

  ngOnInit() {
    this.tooltipWrapper = document.querySelector('.tooltip-wrapper');
    this.tooltipText = document.querySelector('.tooltip-text');
    this.tooltipWrapper.addEventListener('mouseout', function () {
      this.tooltipText.style.display = 'none';
    });

  }

}

