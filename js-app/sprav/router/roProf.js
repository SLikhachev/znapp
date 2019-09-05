// src/sprav/router/profRouter.js

// common
import { moModel } from '../../apps/model/moModel.js';
// sprav
import { restSprav, spravApi } from '../spravApi.js';
import { vuSprav, vuView } from '../view/vuSprav.js';
import { moStruct } from '../model/moStruct.js';
import { idName } from '../model/moStruct.js';

import { vuSheet } from '../view/vuSheet';
import { itemForm } from '../form/foItem';
//
import { vuPmu } from '../view/vuPmu';
import { vuPmuItem } from '../view/vuPmuItem';
import { vuGrupItem } from '../view/vuGrupItem';
import { vuMkb } from '../view/vuMkb';

const vuSpec = function(vnode){
  return vuSheet(vnode);
}
const vuProf = function(vnode){
  return vuSheet(vnode);
}
const vuPrvs = function(vnode){
  return vuSheet(vnode);
}
const vuVidpom = function(vnode){
  return vuSheet(vnode);
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
const vuPgrup = function (vnode) {
  vnode.attrs.itemForm= itemForm;
  let view= vuSheet(vnode);
  return view;
}


export const roProf = {
  [spravApi.prof]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Профильные справочники" } ) );
    }
  },
  
  [spravApi.prof_spec]: {
    render: function() {
      let view = m(vuSpec, {
          model:  moModel.getModel( restSprav.doc_spec ),
          header: "Коды врачебных специальностей",
          name: "Специальность",
          struct: moStruct.doc_spec
      });
      return vuView(view);
    }
  },
  [spravApi.prof_prof]: {
    render: function() {
      let view = m(vuProf, {
          model:  moModel.getModel( restSprav.prof),
          header: "Профили помощи",
          name: "Профиль"
      });
      return vuView(view);
    }
  },
  [spravApi.prof_prvs]: {
    render: function() {
      let view = m(vuPrvs, {
          model:  moModel.getModel( restSprav.prvs),
          header: "Специальности V021",
          name: "Специальность"
      });
      return vuView(view);
    }
  },
  [spravApi.prof_vidpom]: {
    render: function() {
      let view = m(vuVidpom, {
          model:  moModel.getModel( restSprav.vidpom),
          header: "Вид помощи",
          name: "Вид"
      });
      return vuView(view);
    }
  },
  [spravApi.prof_pmus]: {
    render: function() {
      let view = m(vuPmu, {
          model:  moModel.getModel( restSprav.pmu ),
          header: "Простые мед. усдуги",
          name: "Услуга",
          href: spravApi.prof_pmus,
          struct: moStruct.pmu
      });
      return vuView(view);
    }
  },
  [spravApi.prof_pmu_code] : {
    onmatch: function(args) {
      return vuPmuItem;
    },
    render : function(vnode) {
         return vuView( vnode );
      }
  },
  [spravApi.prof_pgrup]: {
    render: function() {
      let view = m(vuPgrup, {
          model:  moModel.getModel( restSprav.pmu_grup ),
          header: "Гуппы ПМУ ",
          name: "Группа",
          filter: 2,
          struct: idName,
          href: spravApi.prof_pgrup,
      });
      return vuView(view);
    }
  },
  [spravApi.prof_pmu_grup]: {
    onmatch: function(args) {
      return vuGrupItem;
    },
    render : function(vnode) {
        return vuView( vnode );
      }
  },
  [spravApi.prof_mkb]: {
    render: function() {
      let view = m(vuMkb, {
          model:  moModel.getModel( restSprav.mkb),
          header: "МКБ - 10",
          name: "Диагноз",
          struct: moStruct.mkb
      });
      return vuView(view);
    }
  },
  /*
  [spravApi.tfoms_purp]: {
    render: function() {
      let view = m(vuPurp, {
          model:  moModel.getModel( restSprav.purp ),
          header: "Цели обращения",
          name: "Цель"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_type]: {
    render: function() {
      let view = m(vuType, {
          model:  moModel.getModel( restSprav.type ),
          header: "Особый случай",
          name: "Случай"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_insur]: {
    render: function() {
      let view = m(vuCateg, {
          model:  moModel.getModel( restSprav.insur),
          header: "Категории ОМС",
          name: "Категория"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_istfin]: {
    render: function() {
      let view = m(vuIstfin, {
          model:  moModel.getModel( restSprav.istfin ),
          header: "Источники финансирования",
          name: "Источник"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_errors]: {
    render: function() {
      let view = m(vuErrors, {
          model:  moModel.getModel( restSprav.errors ),
          header: "Причины отказов",
          name: "Причина"
      });
      return vuView(view);
    }
  },
  */
};
