// src/reestr/router/roInvoice.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moFormModel.js';
//import { moStruct } from '../model/moStruct.js';
//reestr
import { taskReestr, reestrApi, reestrMenu } from '../reestrApi.js';
// import
import { vuInvimp } from '../view/vuInvimp.js';
import { vuSelfcalc } from  '../view/vuSelfcalc.js';

export const roInvoice = {
  [reestrApi.invoice]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Расчеты и реестры" } ) );
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
      let view = m(vuSelfcalc, {
        header: "Собственные расчеты",
        model: moModel.getModel(taskReestr.calc.post_url )
        
      });
      return vuView(reestrMenu, view);
    }
  },

}
