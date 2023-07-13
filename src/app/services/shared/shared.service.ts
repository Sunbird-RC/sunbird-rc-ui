import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  isSetObjectPathVal(objPath, item, isAllValCheck) {

    if (item) {
      const propertySplit = objPath.split(",");

     const fArr =  this.getObjPathVal(propertySplit, item);

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
    const fArr = [];
    if (item) {
    const propertySplit = objPath.split(",");


    for (let k = 0; k < propertySplit.length; k++) {
      const propertyKSplit = propertySplit[k].split(".");

      for (let j = 0; j < propertyKSplit.length; j++) {

        const a = propertyKSplit[j];

        if (j == 0 && item.hasOwnProperty(a)) {
          fieldValue = item[a];
        } else if (fieldValue.hasOwnProperty(a)) {

          fieldValue = fieldValue[a];

        } else if (fieldValue[0]) {
          const arryItem = []
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


