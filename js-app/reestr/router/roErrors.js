// src/reestr/router/roImport.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../model/moModel.js';
import { moStruct } from '../model/moStruct.js';
//reestr
import { taskReestr, restReestr, reestrApi, reestrMenu } from '../reestrApi.js';
// import
import { vuVmxlimp } from '../view/vuVmxlimp.js';
import { vuVmxlast } from '../view/vuVmxlast.js';

export const roErrors = {
  [reestrApi.vmxl]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Правим ошибки реестра" } ) );
    }
  },
  [reestrApi.vmxl_imp]: {
    render: function() {
      let view = m(vuVmxlimp, {
        header: "Импорт протокола ошибок (XML файл)",
        model: moModel.getModel( taskReestr.vmx.post_url )
        
      });
      return vuView(reestrMenu, view);
    }
  },
  [reestrApi.vmxl_last]: {
    render: function() {
      let view = m(vuVmxlast, {
        header: "Последние принятые ошибки",
        model: moModel.getModel( restReestr.vmx.url ),
        struct: moStruct().vmx_last,
        params: restReestr.vmx.params
      });
      return vuView(reestrMenu, view);
    }
  },
}
