// src/sprav/router/profRouter.js

// common
import { moModel } from '../../apps/model/moModel.js';
// sprav
import { restSprav, spravApi } from '../spravApi.js';
import { vuSprav, vuView } from '../view/vuSprav.js';
import { moStruct } from '../model/moStruct.js';
//
//import { vuCatalog } from '../view/vuCatalog.js';
//import { vuDataSheet } from '../view/vuDataSheet.js';
import { vuSheet } from '../view/vuSheet';

const vuDul = function(vnode){
  return vuSheet(vnode);
}
const vuOkato = function(vnode){
  return vuSheet(vnode);
}

export const roCom = {
  [spravApi.com]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Общие справочники" } ) );
    }
  },
  
  [spravApi.com_dul]: {
    render: function() {
      let view = m(vuDul, {
          model:  moModel.getModel( restSprav.dul ),
          header: "Документ удостоверяющий личнось",
          name: "Документ",
          struct: moStruct.dul,
          filter: 2
      });
      return vuView(view);
    }
  },
  [spravApi.com_okato]: {
    render: function() {
      let view = m(vuOkato, {
          model:  moModel.getModel( restSprav.okato),
          header: "ОКАТО",
          name: "ОКАТО",
          struct: moStruct.okato,
          filter: 3
      });
      return vuView(view);
    }
  },

};
