// src/reestr/router/roImport.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moFormModel.js';
import { moStruct } from '../model/moStruct.js';
//reestr
import { taskReestr, reestrApi, reestrMenu } from '../reestrApi.js';
// import
import { vuReestr } from '../view/vuReestr.js';

export const roReestr = {
  [reestrApi.pack]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Пакеты ФОМС" } ) );
    }
  },
  [reestrApi.pack_xml]: {
    render: function() {
      let view = m(vuReestr, {
        header: "Формируем XML пакет для ФОМС",
        model: moModel.getModel( taskReestr.pack.post_url ),
        struct: moStruct().error_pack
        
      });
      return vuView(reestrMenu, view);
    }
  },
  /*
  [reestrApi.pack_errors]: {
    render: function() {
      let view = m(vuPackErrors, {
        header: "Последние ошибки формирования реестра",
        model: moModel.getModel( restReestr.xml.url ),
        struct: moStruct().error_pack,
        params: restReestr.xml.params
      });
      return vuView(reestrMenu, view);
    }
  },
  */
}
