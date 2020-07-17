
// src/sparv/defines/spravLocal.js

// local sprav definition
// item.struct:
// table presentation:
// tr: [ "Column name", 'sortable' ]
// form presentation:
// label: [ labeltext ( default tr column name ), labelclass ], 
// type: 'text' default, 
// tag: [ class, required ], 
// attrs: {} // if any
// form: order of fields tabindex is index

import { editItem, deletItem } from '../../apps/defines/defStruct';


export const spravLocal = {

  page: "Локальные справочники",

  // local sprav
  district: { item: { name: "Участки" } },
  division: { item: { name: "Отделения" } },

  // getter becase ot 'this' refs inside definition of object  
  doctor: {
    rest: {
      params: { order: 'code' },
      options: ['division', 'district'],
    },
    item: {
      name: "Врачи",
      editable: ['add', 'edit', 'del'],
      struct: {
        code: {
          th: ["Код", 'sort', editItem],
          type: 'number', tag: ['.lcode', 'required']
        },
        spec: {
          th: ["Специальность", 'sort'],
          type: 'number', tag: ['.lcode', 'required']
        },
        family: { th: ["Врач"], tag: ['', 'required'] },
        snils: { th: ["СНИЛС"], tag: ['', 'requred'] },
        division: { th: ["Отделение"], type: 'number', tag: ['.lcode'] },
        district: { th: ["Участок"], type: 'number', tag: ['.lcode'] },
        tabid: { th: ["Таб. номер"], type: 'number' },
        ddel: ["Удалить", '', deletItem]
      },
      form: ['family', 'snils', 'code', 'spec', 'division', 'district', 'tabid']
    },
  },
  sp_podr: {
    rest: { params: { order: 'mo_code' } },
    item: {
      name: "Отделения МО",
      struct: {
        mo_code: ["Код", 'sort'],
        id_otd: ['Код отделения'],
        name_otd: ['Наименование'],
        profil: ['Код профиля'],
        prof_name: ['Наименвание профиля']
      },
    }
  },
  sp_para: {
    //rest: { url: 'ytr' },
    item: {
      editable: ['edit'],
      name: 'Диагност. подр.',
      header: 'Диагностические подразделения'
    }
  },
  purpose: {},
  mo_local: {
    item: {
      name: "МО локальные",
      struct: {
        code: ["Код", 'sort'],
        scode: ["Код ТФОМС", 'sort'],
        sname: ["Наименование кратко"],
        name: ["Наименование полное"]
      },
    },
  },
  smo_local: {
    item: {
      name: "СМО локальные",
      struct: {
        code: ["Код", 'sort'],
        okato: ["ОКАТО", 'sort'],
        name: ["Наименование"]
      }
    }
  },
}


export const local = {
  path: '/local/:item',
  name: "Локальные",
  def: spravLocal,
  items: ['doctor', 'sp_para', 'mo_local', 'smo_local']
};