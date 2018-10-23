// src/sprav/router.moRouter.js

// common
import { moModel } from '../../apps/model/moModel.js';
// sprav
import { spravApi } from '../spravApi.js';
import { vuSprav, vuView } from '../view/vuSprav.js';
import { moStruct } from '../model/moStruct.js';
//
import { vuCatalog } from '../view/vuCatalog.js';
import { vuDoctor } from '../view/vuDoctor.js';
import { vuMoLocal } from '../view/vuMoLocal.js';
import { vuSmoLocal } from '../view/vuSmoLocal.js';

const vuDist = function(vnode){
  return vuCatalog(vnode);
}
const vuDivs = function(vnode){
  return vuCatalog(vnode);
}

const roLocal = {
  [spravApi.mo]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Cправочники локальные" } ) );
    }
  },
  [spravApi.mo_doct]: {
    render: function() {
      let view = m(vuDoctor, {
        model: moModel.getModel(restApi.doctor),
        header: "Врачи",
        name: "Врач",
        find: 3, // search in the first 3 table columns
        struct: moStruct.doctor
      });
      return vuView(view);
    }
  },
  [spravApi.mo_dist]: {
    render: function() {
      let view = m(vuDist, {
        model: moModel.getModel( restApi.district ),
        header: "Врачебные участки",
        name: "Участок"
      });
      return vuView(view);
    }
  },
  [spravApi.mo_divs]: {
    render: function() {
      let view = m(vuDivs, {
        model: moModel.getModel( restApi.division ),
        header: "Отделения МО",
        name: "Отделение"
      });
      return vuView(view);
    }
  },
  [spravApi.mo_local]: {
    render: function() {
      let view = m(vuMoLocal, {
          model: moModel.getModel( restApi.mo_local ),
          header: "МО Приморского края",
          name: "МО",
          find: 3, // search in the first 3 table columns
          struct: moStruct.moLocal
        });
        return vuView(view);
      }
  },
  [spravApi.mo_smo]: {
    render: function() {
      let view = m(vuSmoLocal, {
        model: moModel.getModel( restApi.smo_local ),
        header: "СМО Приморского края",
        name: "СМО",
        find: 2, // search in the first 3 table columns
        struct: moStruct.smoLocal
      });
      return vuView(view);
    }
  },
}

export { roLocal };