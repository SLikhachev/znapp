// src/reestr/router/roReestr.js

// common
import { vuApp, vuView } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moFormModel.js';
import { moStruct } from '../model/moStruct.js';
//reestr
import { taskReestr, reestrApi, reestrMenu } from '../reestrApi.js';
// import
import { vuReestr, vuPackTest } from '../view/vuReestr.js';

const _attrs= (hdr, test='') => { return {
  header: hdr,
  model: moModel.getModel( taskReestr.pack.post_url ),
  struct: moStruct().error_pack,
  test: test
}}

export const roReestr = {
  [reestrApi.pack]: {
    render: function() {
      return vuView(reestrMenu, m(vuApp, { text: "Пакеты для ФОМС" } ) );
    }
  },
  [reestrApi.pack_test]: {
    render: function() {
      const view = m(vuPackTest, _attrs("Проверяем талоны", 'test') );
      return vuView(reestrMenu, view);
    }
  },

  [reestrApi.pack_xml]: {
    render: function() {
      const view = m(vuReestr, _attrs("Формируем XML пакет для ФОМС") );
      return vuView(reestrMenu, view);
    }
  },
  
}
