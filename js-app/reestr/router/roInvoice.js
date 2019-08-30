// src/reestr/router/roImport.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../model/moModel.js';
//import { moStruct } from '../model/moStruct.js';
//reestr
import { taskReestr, reestrApi, reestrMenu } from '../reestrApi.js';
// import
import { vuInvimp } from '../view/vuInvimp.js';
import { vuInvcalc } from '../view/vuInvcalc.js';

export const roInvoice = {
  [reestrApi.invoice]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Счета и реестры для СМО и ФОМС" } ) );
    }
  },
  [reestrApi.inv_impex]: {
    render: function() {
      let view = m(vuInvimp, {
        header: "Реестр в СМО из ZIP файла счета БАРС",
        model: moModel.getModel( taskReestr.invoice.post_url )
        
      });
      return vuView(reestrMenu, view);
    }
  },
  [reestrApi.inv_calc]: {
    render: function() {
      let view = m(vuInvcalc, {
        header: "Собственные рассчеты",
       //model: moModel.getModel()
        
      });
      return vuView(reestrMenu, view);
    }
  },
}
