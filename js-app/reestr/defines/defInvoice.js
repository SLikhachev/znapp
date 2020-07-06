
// src/reestr/defines/defXmlerrr.js
// packages definition

import { $checkbox, $button } from '../../apps/defines/defStruct';


const packType = {
  1: "Амбулаторный",
  2: "Онкология",
  3: "Дневной стационар",
  4: "Профосмотр",
  5: "Инокраевые",
  6: "Тарифы ПМУ"
}

export const calcInvoice = {

  page: "Расчеты и реестры в СМО",

  tosmo: {
    task: {
      url: "/reestr/inv/impex",
      get: "/utils/file/reestr/inv/",  //GET reestr file  
      form: {
        legend: "Файл счета БАРС",
        file: { type: 'file' },
        pack: {
          label: ["Тип счета"],
          tag: ['.ml10'],
          type: 'select',
          options: packType,
          attrs: { 'data-initial': 1 }
        },
        csmo: $checkbox("Корректировать СМО"),
      },
      buttons: {
        butt1: $button("Импорт")
      },
    },
    item: {
      name: "Реестр в СМО",
      header: "Реестр в СМО из ZIP файла счета БАРС",
    },
  },
}


export const invce = {
  path: '/invce/:item',
  name: "Счета",
  def: calcInvoice,
  items: ['tosmo']
};