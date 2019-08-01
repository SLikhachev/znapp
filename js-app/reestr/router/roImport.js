// src/reestr/router/roImport.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../model/moModel.js';
import { moStruct } from '../model/moStruct.js';
//reestr
import { reestrApi, reestrMenu } from '../reestrApi.js';
// import
import { vuRdbf } from '../view/vuRdbf.js';
//import { vuVolum } from '../view/vuRdbf.js';

export const roImport = {
  [reestrApi._import]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Импорт файлов" } ) );
    }
  },
  [reestrApi.dbf_imp]: {
    render: function() {
      let view = m(vuRdbf, {
        header: "Импорт реестов DBF",
        model: moModel.getModel()
        
      });
      return vuView(reestrMenu, view);
    }
  },
}
