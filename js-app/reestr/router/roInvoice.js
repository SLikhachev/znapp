// src/reestr/router/roImport.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../model/moModel.js';
import { moStruct } from '../model/moStruct.js';
//reestr
import { reestrApi, reestrMenu } from '../reestrApi.js';
// import
import { vuInvoce } from '../view/vuInvoice.js';

export const roReestr = {
  [reestrApi.invoice]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Счета и реестры для СМО и ФОМС" } ) );
    }
  },
  [reestrApi.invoice_exp]: {
    render: function() {
      let view = m(vuInvoice, {
        header: "Формируем XLSX файл реестра пролеченных из XML счета",
       //model: moModel.getModel()
        
      });
      return vuView(reestrMenu, view);
    }
  },
}
