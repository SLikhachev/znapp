// src/reestr/router/roImport.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../model/moModel.js';
import { moStruct } from '../model/moStruct.js';
//reestr
import { reestrApi, reestrMenu } from '../reestrApi.js';
// import
import { vuReestr } from '../view/vuReestr.js';

export const roReestr = {
  [reestrApi.reestr]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Пакеты ФОМС" } ) );
    }
  },
  [reestrApi.resstr_xml]: {
    render: function() {
      let view = m(vuReestr, {
        header: "Формируем XML пакет для ФОМС",
       //model: moModel.getModel()
        
      });
      return vuView(reestrMenu, view);
    }
  },
}
