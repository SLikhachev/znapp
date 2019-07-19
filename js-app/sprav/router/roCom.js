// src/sprav/router/profRouter.js

// common
import { moModel } from '../../apps/model/moModel.js';
// sprav
import { restSprav, spravApi } from '../spravApi.js';
import { vuSprav, vuView } from '../view/vuSprav.js';
import { moStruct } from '../model/moStruct.js';
//
import { vuCatalog } from '../view/vuCatalog.js';
import { vuDataSheet } from '../view/vuDataSheet.js';

const vuDul = function(vnode){
  return vuCatalog(vnode);
}
const vuOkato = function(vnode){
  return vuCatalog(vnode);
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
          name: "Документ"
      });
      return vuView(view);
    }
  },
  [spravApi.com_okato]: {
    render: function() {
      let view = m(vuOkato, {
          model:  moModel.getModel( restSprav.okato),
          header: "ОКАТО",
          name: "ОКАТО"
      });
      return vuView(view);
    }
  },

};
