// src/reestr/router/roImport.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../model/moModel.js';
import { moStruct } from '../model/moStruct.js';
//reestr
import { pgRest, appApi, appMenu } from '../reestrApi.js';
// import
import { vuRdbf } from '../view/vuRdbf.js';
//import { vuVolum } from '../view/vuRdbf.js';

const roImport = {
  [appApi.import]: {
    render: function() {
      return vuView(appMenu, m(vuApp, { text: "Импорт файлов" } ) );
    }
  },
  [appApi.reestr_imp]: {
    render: function() {
      let view = m(vuRdbf, {
        header: "Импорт реестов DBF",
        model: moModel.getModel()
        
      });
      return vuView(appMenu, view);
    }
  },
  /*
  [appApi.surv_volum]: {
    render: function() {
      //console.log(pgRest.volum);
      let view = m(vuVolum, {
        header: "Обемы помощи приказ 146",
        model: moModel.getModel( pgRest.volum ),
        struct: moStruct().p146_report,
        //form: true
      });
      return vuView(appMenu, view);
    }
  },
  */
}

export { roImport };