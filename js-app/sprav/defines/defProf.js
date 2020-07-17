
// src/sparv/defines/spravProfil.js
// prof sprav definition

import { editItem } from '../../apps/defines/defStruct';

export const spravProf = {

  page: "Профильные справочники",

  // profil sprav
  doc_spec: {
    rest: {
      url: "spec_prvs_profil",
      params: { order: 'spec' },
    },
    item: {
      name: "Специальности",
      pk: 'spec',
      editable: ['add', 'edit'],
      struct: {
        spec: ["Код", 'sort', editItem],
        name: ["Специальность"],
        prvs: ["Код PRVS V021"],
        profil: ["Профиль"],
        prof_k: ["Профиль койки"],
        det: { th: ["Детский"], type: 'checkbox' }
      }
    },
  },

  profil: {
    item: {
      name: "Профили",
      editable: ['edit'],
      editable_fields: ['one_visit', 'two_visit', 'podr'],
      struct: {
        id: { th: ["Код", 'sort', editItem], tag: ['', 'readonly'] },
        name: { th: ["Профиль"], tag: ['', 'readonly'] },
        one_visit: ["ПМУ посещение"],
        two_visit: ["ПМУ обращение"],
        podr: ["Подразделение"]
      }
    }
  },
  prvs: { item: { name: "PRVS" } },
  vidpom: { item: { name: "Вид помощи" } },

  mkb10: {
    rest: { params: { order: 'code.asc', limit: 20 } },
    fetch: {
      code: {
        //label: ["Код диагноза МКБ-10"],
        tag: ['.input-find.pure-u-2-4', 'required'],
        attrs: { placeholder: "Код диагноза МКБ-10" },
        params: 'ilike.*'
      },
    },
    item: {
      find: 0,
      name: "МКБ-10",
      struct: {
        code: ['Код', 'sort'],
        name: ['Описание'],
        oms: ['ОМС'],
        oms_ds: ['ОМС ДС']
      }
    }
  },
  char_main: {},
  travma_type: {},
  ist_fin: {},
  cishod: {},
  cresult: {},
}

export const prof = {
  path: '/prof/:item',
  name: "Профильные",
  def: spravProf,
  items: ['doc_spec', 'profil', 'prvs', 'vidpom', 'mkb10']
};