// src/reestr/router/roImport.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../model/moModel.js';
//reestr
import { taskReestr, reestrApi, reestrMenu } from '../reestrApi.js';
// import
import { vuRdbf } from '../view/vuRdbf.js';
//import { vuVolum } from '../view/vuRdbf.js';

export const roImport = {
  [reestrApi.impo]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Импорт файлов" } ) );
    }
  },
  [reestrApi.impo_dbf]: {
    render: function() {
      let view = m(vuRdbf, {
        header: "Импорт реестов DBF",
        model: moModel.getModel( taskReestr.impo_dbf.post_url )
      });
      return vuView(reestrMenu, view);
    }
  },
}
