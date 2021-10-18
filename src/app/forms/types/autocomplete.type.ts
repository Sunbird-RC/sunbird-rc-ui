import { startWith, switchMap, takeUntil, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'formly-autocomplete-type',
  template: `
  <ng-select [items]="options$ | async"
  [bindLabel]="to.label"
  autofocus
  [bindValue]="to.label"
  [placeholder]="to.placeholder"
  [typeahead]="search$"
  [formControl]="formControl">
<br>
  `,
})
export class AutocompleteTypeComponent extends FieldType implements OnDestroy {
  onDestroy$ = new Subject<void>();
  search$ = new EventEmitter();
  bind$;
  options$;

  ngOnInit() {
    this.options$ = this.search$.pipe(
      takeUntil(this.onDestroy$),
      startWith(''),
      filter(v => v !== null),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(this.to.search$),
    );

    this.options$.subscribe();
  }

  ngOnDestroy() {
    this.onDestroy$.complete();
  }
}