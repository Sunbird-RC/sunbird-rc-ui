import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  constructor(
    private toastr: ToastrService
  ) { }

  success(title, message) {
    this.destroytoast();
    this.toastr.success(message, title);
  }

  error(title, message) {
    this.destroytoast();
    this.toastr.error(message, title);
  }

  info(title, message) {
    this.destroytoast();
    this.toastr.info(message, title);
  }

  warning(title, message) {
    this.destroytoast();
    this.toastr.warning(message, title);
  }

  /**
   * Destroys IziToast
   */
  destroytoast() {
      this.toastr.clear();
  }
}
