// src/sprav/router/profRouter.js

// common
import { vuApp } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moModel.js';
// sprav
import { restSprav, spravApi } from '../spravApi.js';
import { vuSprav } from '../view/vuSprav.js';
import { moStruct } from '../model/moStruct.js';
//import { idName } from '../model/moStruct.js';

//import { itemProfil } from '../form/spravForm';

import { vuSheet } from '../view/vuSheet';
//import { itemForm } from '../form/foItem';
//
import { itemTarifBase } from '../form/spravForm';
import { vuTarifPmuVzaimo } from '../view/vuTarifPmuVzaimo';

const vuBase = vnode=> vuSheet(vnode);

export const roTarif = {
  [spravApi.tarif]: {
    render: function() {
      return vuSprav( m(vuApp, { text: "Тарифы ТТС" } ) );
    }
  },
  
  [spravApi.tarif_base]: {
    render: function() {
      const view = m(vuBase, {
          model:  moModel.getModel( restSprav.tarif_base ),
          header: "Базовые тарифы и коэфициенты",
          name: "Тфриф",
          struct: moStruct.tarif_base,
          itemForm: itemTarifBase,
      });
      return vuSprav(view);
    }
  },
  
  [spravApi.tarif_pmu_vzaimo]: {
    render: function() {
      const view = m(vuTarifPmuVzaimo, {
          model:  moModel.getModel( restSprav.tarif_pmu_vzaimo ),
          header: "Тарифы на ПМУ по взаиморасчетам",
          name: "Тариф",
          struct: moStruct.tarif_pmu_vzaimo,
      });
      return vuSprav(view);
    }
  },
  
};
