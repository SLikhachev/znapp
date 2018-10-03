// src/sprav/router/tfomsRouter.js

// common
import { moModel } from '../../apps/model/moModel.js';
// sprav
import { spravApi } from '../spravApi.js';
import { vuSprav, vuView } from '../view/vuSprav.js';
import { moStruct } from '../model/moStruct.js';
//
import { vuCatalog } from '../view/vuCatalog.js';
import { vuDataSheet } from '../view/vuDataSheet.js';

const vuSpec = function(vnode){
  return vuCatalog(vnode);
}
const vuSpPodr = function(vnode){
  return vuDataSheet(vnode);
}
const vuSpPara = function(vnode){
  return vuCatalog(vnode);
}
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

const roTfoms = {
  [spravApi.tfoms]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Cправочники ТФОМС" } ) );
    }
  },
  
  [spravApi.tfoms_spec]: {
    render: function() {
      let view = m(vuSpec, {
          model:  moModel.getModel( restApi.doc_spec ),
          header: "Коды врачебных специальностей",
          name: "Специальность"
      });
      return vuView(view);
    }
  },
  [spravApi.tfoms_podr]: {
    render: function() {
      let view = m(vuSpPodr, {
          model: moModel.getModel( restApi.sp_podr ),
          header: "Отдеделения МО ПК",
          name: "Отделение",
          find: 2, // search in the first 1 table columns
          struct: moStruct.spPodr
        });
      return vuView(view);
    }
  },
  [spravApi.tfoms_para_podr]: {
    render: function() {
      let view = m(vuSpPara, {
          model:  moModel.getModel( restApi.sp_para),
          header: "Коды диагностических подразделений",
          name: "Плдазделение"
      });
      return vuView(view);
    }
  },
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
};

export { roTfoms };