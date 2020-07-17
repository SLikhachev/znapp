
// src/sparv/defines/spravTarif.js
// tarifs sprav definition

import { editItem } from '../../apps/defines/defStruct';

export const spravTarif = {

  page: "Тарифы ТТС",

  tarifs_base: {
    item: {
      name: "Базовый",
      editable: ['edit'],
      header: "Базовые тарифы и коэфициенты",
      struct: {
        id: ["№ п/п", '', editItem],
        name: ["Тариф"],
        tarif: ["Цена руб./ Коэфф. "],
      },
      form: ['name', 'tarif']
    },
  },
  tarifs_pmu_vzaimoras: {
    rest: { params: { order: 'code.asc', limit: 20 } },
    fetch: {
      code: {
        th: [],
        //label: ["Код диагноза МКБ-10"],
        tag: ['.input-find.pure-u-2-4', 'required'],
        attrs: { placeholder: "Код ПМУ" },
        params: 'ilike.*'
      },
    },
    item: {
      find: 0,
      name: "ПМУ взаиморас.",
      editable: ['edit'],
      header: "Тарифы на ПМУ по взаиморасчетам",
      struct: {
        id: ["№ п/п", '', editItem],
        code: { th: ["Код ПМУ"], tag: ['', 'readonly'] },
        tarif: ["Цена руб."],
        name: { th: ["ПМУ"], tag: ['', 'readonly'] }
      },
      form: ['code', 'name', 'tarif']
    },
  }
}

export const tarif = {
  path: '/tarif/:item',
  name: "Тарифы",
  def: spravTarif,
  items: ['tarifs_base', 'tarifs_pmu_vzaimoras']
};