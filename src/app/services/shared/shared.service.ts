import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  isSetObjectPathVal(objPath, item, isAllValCheck) {

    if (item) {
      var propertySplit = objPath.split(",");

     let fArr =  this.getObjPathVal(propertySplit, item);

      let val;
      if (isAllValCheck) {

        return val = (propertySplit.length == fArr.length) ? true : false
      } else {
        return val = (fArr.length) ? true : false

      }
    }
  }


  getObjPathVal(objPath, item)
  {
    let fieldValue = [];
    let fArr = [];
    if (item) {
    var propertySplit = objPath.split(",");


    for (let k = 0; k < propertySplit.length; k++) {
      var propertyKSplit = propertySplit[k].split(".");

      for (let j = 0; j < propertyKSplit.length; j++) {

        let a = propertyKSplit[j];

        if (j == 0 && item.hasOwnProperty(a)) {
          fieldValue = item[a];
        } else if (fieldValue.hasOwnProperty(a)) {

          fieldValue = fieldValue[a];

        } else if (fieldValue[0]) {
          let arryItem = []
          if (fieldValue.length > 0) {

            fieldValue = arryItem;

          } else {
            fieldValue = fieldValue[a];
          }

        } else {
          fieldValue = [];
        }
      }
      fieldValue.length ? fArr.push(fieldValue) : [];
    }

    return fArr;
  }
}
}


