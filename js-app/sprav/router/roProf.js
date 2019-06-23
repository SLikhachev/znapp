// src/sprav/router/profRouter.js

// common
import { moModel } from '../../apps/model/moModel.js';
// sprav
import { restApi, spravApi } from '../spravApi.js';
import { vuSprav, vuView } from '../view/vuSprav.js';
import { moStruct } from '../model/moStruct.js';
//
import { vuCatalog } from '../view/vuCatalog.js';
import { vuDataSheet } from '../view/vuDataSheet.js';
import { vuItemSheet } from '../view/vuItemSheet';

import { pmuFind } from '../view/vuPmu'; 

const vuSpec = function(vnode){
  return vuCatalog(vnode);
}
const vuProf = function(vnode){
  return vuDataSheet(vnode);
}
const vuPrvs = function(vnode){
  return vuDataSheet(vnode);
}
const vuVidpom = function(vnode){
  return vuDataSheet(vnode);
}
const vuPmu = function(vnode){
  return vuItemSheet(vnode);
}
const vuMkb = function(vnode){
  return vuDataSheet(vnode);
}
/*
const vuPurp = function(vnode){
  return vuCatalog(vnode);
}
const vuType = function(vnode){
  return vuCatalog(vnode);
}
const vuCateg = function(vnode){
  return vuCatalog(vnode);
}
const vuIstfin = function(vnode){
  return vuCatalog(vnode);
}
const vuErrors = function(vnode){
  return vuCatalog(vnode);
}
*/
export const roProf = {
  [spravApi.prof]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Профильные справочники" } ) );
    }
  },
  
  [spravApi.prof_spec]: {
    render: function() {
      let view = m(vuSpec, {
          model:  moModel.getModel( restApi.doc_spec ),
          header: "Коды врачебных специальностей",
          name: "Специальность"
      });
      return vuView(view);
    }
  },
  [spravApi.prof_prof]: {
    render: function() {
      let view = m(vuProf, {
          model:  moModel.getModel( restApi.prof),
          header: "Профили помощи",
          name: "Профиль"
      });
      return vuView(view);
    }
  },
  [spravApi.prof_prvs]: {
    render: function() {
      let view = m(vuPrvs, {
          model:  moModel.getModel( restApi.prvs),
          header: "Специальности V021",
          name: "Специальность"
      });
      return vuView(view);
    }
  },
  [spravApi.prof_vidpom]: {
    render: function() {
      let view = m(vuVidpom, {
          model:  moModel.getModel( restApi.vidpom),
          header: "Вид помощи",
          name: "Вид"
      });
      return vuView(view);
    }
  },
  [spravApi.prof_pmu]: {
    render: function() {
      let view = m(vuPmu, {
          model:  moModel.getModel( restApi.pmu),
          header: "Простые мед. усдуги",
          //name: "Услуга",
          findForm: pmuFind,
          struct: moStruct.pmu
          
      });
      return vuView(view);
    }
  },
  [spravApi.prof_mkb]: {
    render: function() {
      let view = m(vuMkb, {
          model:  moModel.getModel( restApi.mkb),
          header: "МКБ - 10",
          name: "Диагноз"
      });
      return vuView(view);
    }
  },
  /*
  [spravApi.tfoms_purp]: {
    render: function() {
      let view = m(vuPurp, {
          model:  moModel.getModel( restApi.purp ),
          header: "Цели обращения",
          name: "Цель"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_type]: {
    render: function() {
      let view = m(vuType, {
          model:  moModel.getModel( restApi.type ),
          header: "Особый случай",
          name: "Случай"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_insur]: {
    render: function() {
      let view = m(vuCateg, {
          model:  moModel.getModel( restApi.insur),
          header: "Категории ОМС",
          name: "Категория"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_istfin]: {
    render: function() {
      let view = m(vuIstfin, {
          model:  moModel.getModel( restApi.istfin ),
          header: "Источники финансирования",
          name: "Источник"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_errors]: {
    render: function() {
      let view = m(vuErrors, {
          model:  moModel.getModel( restApi.errors ),
          header: "Причины отказов",
          name: "Причина"
      });
      return vuView(view);
    }
  },
  */
};
