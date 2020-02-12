// src/sprav/router/profRouter.js

// common
import { vuApp } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moModel.js';
// sprav
import { restSprav, spravApi } from '../spravApi.js';
import { vuSprav } from '../view/vuSprav.js';
import { moStruct } from '../model/moStruct.js';
//
import { vuSheet } from '../view/vuSheet';

const vuDul= vnode=> vuSheet(vnode);
const vuOkato= vnode=> vuSheet(vnode);

export const roCom = {
  [spravApi.com]: {
    render() {
      return vuSprav( m(vuApp, { text: "Общие справочники" } ) );
    }
  },
  
  [spravApi.com_dul]: {
    render: function() {
      const view = m(vuDul, {
          model:  moModel.getModel( restSprav.dul ),
          header: "Документ удостоверяющий личнось",
          name: "Документ",
          struct: moStruct.dul,
          filter: 2
      });
      return vuSprav(view);
    }
  },
  [spravApi.com_okato]: {
    render: function() {
      const view = m(vuOkato, {
          model:  moModel.getModel( restSprav.okato),
          header: "ОКАТО",
          name: "ОКАТО",
          struct: moStruct.okato,
          filter: 3
      });
      return vuSprav(view);
    }
  },

};
