// src/sprav/router/roOnko.js

// common
import { moModel } from '../../apps/model/moModel.js';
// sprav
import { spravApi } from '../spravApi.js';
import { vuSprav, vuView } from '../view/vuSprav.js';
import { moStruct } from '../model/moStruct.js';
//
import { vuCatalog } from '../view/vuCatalog.js';
import { vuDataSheet } from '../view/vuDataSheet.js';

const vuN1 = function(vnode){
  return vuCatalog(vnode);
}
const vuN2 = function(vnode){
  return vuDataSheet(vnode);
}
const vuN3 = function(vnode){
  return vuDataSheet(vnode);
}
const vuN4 = function(vnode){
  return vuDataSheet(vnode);
}
const vuN5 = function(vnode){
  return vuDataSheet(vnode);
}
const vuN7 = function(vnode){
  return vuCatalog(vnode);
}
const vuN8 = function(vnode){
  return vuDataSheet(vnode);
}
const vuN9 = function(vnode){
  return vuDataSheet(vnode);
}
const vuN10 = function(vnode){
  return vuDataSheet(vnode);
}
const vuN11 = function(vnode){
  return vuDataSheet(vnode);
}
const vuN12 = function(vnode){
  return vuDataSheet(vnode);
}
const vuN13 = function(vnode){
  return vuCatalog(vnode);
}
const vuN14 = function(vnode){
  return vuCatalog(vnode);
}
const vuN15 = function(vnode){
  return vuCatalog(vnode);
}
const vuN16 = function(vnode){
  return vuCatalog(vnode);
}
const vuN17 = function(vnode){
  return vuCatalog(vnode);
}

const roOnko = {
  [spravApi.onko]: {
    render: function() {
      return vuView( m(vuSprav, { text: "Cправочники по онкологии" } ) );
    }
  },
  
  [spravApi.onko_n1]: {
    render: function() {
      let view = m(vuN1, {
          model:  moModel.getModel( restApi.onko_n1 ),
          header: "Коды отказов",
          name: "Отказ"
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n2]: {
    render: function() {
      let view = m(vuN2, {
          model: moModel.getModel( restApi.onko_n2 ),
          header: "Стадия заболевания",
          name: "Стадия",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n2
        });
      return vuView(view);
    }
  },
  [spravApi.onko_n3]: {
    render: function() {
      let view = m(vuN3, {
          model:  moModel.getModel( restApi.onko_n3),
          header: "Tumor",
          name: "Tumor",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n3
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n4]: {
    render: function() {
      let view = m(vuN4, {
          model:  moModel.getModel( restApi.onko_n4 ),
          header: "Nodus",
          name: "Nodus",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n4
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n5]: {
    render: function() {
      let view = m(vuN5, {
          model:  moModel.getModel( restApi.onko_n5 ),
          header: "Метазтазы",
          name: "Метастазы",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n5
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n7]: {
    render: function() {
      let view = m(vuN7, {
          model:  moModel.getModel( restApi.onko_n7),
          header: "Гистология",
          name: "Наименование"
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n8]: {
    render: function() {
      let view = m(vuN8, {
          model:  moModel.getModel( restApi.onko_n8 ),
          header: "Гистлогия результат",
          name: "Результат",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n8
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n9]: {
    render: function() {
      let view = m(vuN9, {
          model:  moModel.getModel( restApi.onko_n9 ),
          header: "Гистология диагноз",
          name: "Диагноз",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n9
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n10]: {
    render: function() {
      let view = m(vuN10, {
          model:  moModel.getModel( restApi.onko_n10 ),
          header: "Онкомаркеры",
          name: "Маркер",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n10
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n11]: {
    render: function() {
      let view = m(vuN11, {
          model:  moModel.getModel( restApi.onko_n11 ),
          header: "Онкомаркеры значение",
          name: "Маркер",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n11
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n12]: {
    render: function() {
      let view = m(vuN12, {
          model:  moModel.getModel( restApi.onko_n12 ),
          header: "Онкомаркеры диагноз",
          name: "Маркер",
          find: 2, // search in the first 1 table columns
          struct: moStruct.onko_n12
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n13]: {
    render: function() {
      let view = m(vuN13, {
          model:  moModel.getModel( restApi.onko_n13 ),
          header: "Тип лечения",
          name: "Тип",
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n14]: {
    render: function() {
      let view = m(vuN14, {
          model:  moModel.getModel( restApi.onko_n14 ),
          header: "Тип хирургического лечения",
          name: "Тип",
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n15]: {
    render: function() {
      let view = m(vuN15, {
          model:  moModel.getModel( restApi.onko_n15),
          header: "Линии лекрственной тераапии",
          name: "Линия",
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n16]: {
    render: function() {
      let view = m(vuN16, {
          model:  moModel.getModel( restApi.onko_n16 ),
          header: "Циклы лекарственной терапии",
          name: "Цикл",
      });
      return vuView(view);
    }
  },
  [spravApi.onko_n17]: {
    render: function() {
      let view = m(vuN17, {
          model:  moModel.getModel( restApi.onko_n17),
          header: "Тип лучевой терапии",
          name: "Тип",
      });
      return vuView(view);
    }
  },
};

export { roOnko };