// src/sprav/router.moRouter.js

// common
import { moModel } from '../../apps/model/moModel.js';
// sprav
import { restSprav, spravApi } from '../spravApi.js';
import { vuSprav, vuView } from '../view/vuSprav.js';
import { idName, moStruct } from '../model/moStruct.js';
//
import { vuSheet } from '../view/vuSheet.js';
import { vuDoctor } from '../view/vuDoctor.js';

/*
const vuDist = function(vnode){
  return vuCatalog(vnode);
}
const vuDivs = function(vnode){
  return vuCatalog(vnode);
}
const vuSpPodr = function(vnode){
  return vuDataSheet(vnode);
}
*/
const vuSpPara = function(vnode){
  return vuSheet(vnode);
};
const vuMoLocal = function(vnode){
  return vuSheet(vnode);
}
const vuSmoLocal = function(vnode){
  return vuSheet(vnode);
}


export const roLocal = {
  [spravApi.mo]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Cправочники локальные" } ) );
    }
  },
  [spravApi.mo_doct]: {
    render: function() {
      let view = m(vuDoctor, {
        model: moModel.getModel(restSprav.doctor),
        header: "Врачи",
        name: "Врач",
        filter: 3, // search in the first 3 table columns
        struct: moStruct.doctor
      });
      return vuView(view);
    }
  },
  /*
  [spravApi.mo_dist]: {
    render: function() {
      let view = m(vuDist, {
        model: moModel.getModel( restSprav.district ),
        header: "Врачебные участки",
        name: "Участок"
      });
      return vuView(view);
    }
  },
  [spravApi.mo_divs]: {
    render: function() {
      let view = m(vuDivs, {
        model: moModel.getModel( restSprav.division ),
        header: "Отделения МО",
        name: "Отделение"
      });
      return vuView(view);
    }
  },
  [spravApi.mo_podr]: {
    render: function() {
      let view = m(vuSpPodr, {
          model: moModel.getModel( restSprav.sp_podr ),
          header: "Отдеделения МО ПК",
          name: "Отделение",
          find: 2, // search in the first 1 table columns
          struct: moStruct.spPodr
        });
      return vuView(view);
    }
  },
  */
  [spravApi.mo_sp_para]: {
    render: function() {
      let view = m(vuSpPara, {
          model:  moModel.getModel( restSprav.sp_para),
          header: "Коды диагностических подразделений",
          name: "Подазделение",
          struct: idName
      });
      return vuView(view);
    }
  },
  
  [spravApi.mo_local]: {
    render: function() {
      let view = m(vuMoLocal, {
          model: moModel.getModel( restSprav.mo_local ),
          header: "МО Приморского края",
          name: "МО",
          filter: 3, // search in the first 3 table columns
          struct: moStruct.moLocal
        });
        return vuView(view);
      }
  },
  [spravApi.mo_smo]: {
    render: function() {
      let view = m(vuSmoLocal, {
        model: moModel.getModel( restSprav.smo_local ),
        header: "СМО Приморского края",
        name: "СМО",
        struct: moStruct.smoLocal
      });
      return vuView(view);
    }
  },
}
