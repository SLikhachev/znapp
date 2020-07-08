
// src/reestr/defines/defXmlerrr.js
// packages definition

import { $checkbox, $button, $month } from '../../apps/defines/defStruct';


const packType = {
  1: "Амбулаторный",
  2: "Онкология",
  3: "Дневной стационар",
  4: "Профосмотр",
  5: "Инокраевые",
  6: "Тарифы ПМУ"
}

const smoId = {
  0: "ФОМС",
  '25016': "СВ Прим",
  '25011': "ВС Альянс"
}

const $pack = {
  label: ["Тип счета"],
  tag: ['.ml10'],
  type: 'select',
  options: packType,
  attrs: { 'data-initial': 1 }
}

const $smo = {
  label: ["СМО"],
  tag: ['.ml10'],
  type: 'select',
  options: smoId,
  attrs: { 'data-initial': 0 }
}


export const calcInvoice = {

  page: "Расчеты и реестры в СМО",

  tosmo: {
    fetch: {
      url: 'task_rest',
      task: {
        params: 'eq.',
        value: 'import_invoice'
      },
      select: {
        value: 'file_name,pack_type(descr)'
      }
    },
    task: {
      url: "/reestr/inv/impex",
      get: "/utils/file/reestr/inv/",  //GET reestr file  
      form: {
        legend: "Файл счета БАРС",
        file: { type: 'file' },
        pack: $pack,
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
  calc: {
    task: {
      url: "/reestr/inv/calc",
      get: "/utils/file/reestr/calc/",  //GET reestr file  
      form: {
        legend: "Рассчитать реестр по месяцу и СМО",
        month: $month,
        pack: $pack,
        smo: $smo,
      },
      buttons: {
        butt1: $button("Рассчитать")
      },
    },
    item: {
      name: "Расчеты",
      header: "Собственные расчеты",
    },
  },
  mek: {
    task: {
      url: "/reestr/inv/mek",
      get: "/utils/file/reestr/mek/", //GET mek file
      form: {
        legend: "Выгрузить отказанных по МЭК в CSV файл",
        month: $month,
      },
      buttons: {
        but1: R.assocPath(['attrs', 'method'], 'GET', $button("Выгрузить")),
        but2: R.compose(
          R.assocPath(['attrs', 'style'], 'font-size: 1.2em; margin: 0.5em 0 0 2em;'),
          R.assocPath(['tag'], ['.pure-button']))
          ($button("Перенести МЭКи на месяц вперед"))
      }
    },
    item: {
      name: "Перенести МЭК",
      header: "Переносим случаи отказа по МЭК",
    },
  }
}


export const invce = {
  path: '/invce/:item',
  name: "Счета",
  def: calcInvoice,
  items: ['tosmo', 'calc', 'mek']
};