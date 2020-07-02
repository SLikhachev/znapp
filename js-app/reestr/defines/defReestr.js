
// src/reestr/defines/defReestr.js
// packages definition

import { $month, $button_attrs } from '../../apps/defines/defStruct';
import { _mo } from '../../apps/model/moModel';

export const reestrPack = {

  page: "Проверка и Пакеты для ФОМС",

  test: {
    rest: {
      url: 'error_pack',
      params: { order: 'tal_num.asc' }, // just test pack
    },
    task: {
      url: "/reestr/xml/pack",
      get: "/utils/file/reestr/xml/",
      form: {
        legend: "Параметры проверки",
        month: $month,
        test: { type: 'checkbox', attrs: { style: 'display: none', 'data-initial': 1 } }
      },
      buttons: {
        butt1: {
          label: ["Прверить"], type: 'submit',
          tag: ['.pure-button.pure-button-primary'],
          attrs: $button_attrs
        },
      }
    },
    item: {
      name: "Проверить",
      header: "Проверяем талоны",
      struct: {
        tal_num: ['Талон'],
        crd_num: ['Карта'],
        error: ['Ошибка']
      }
    },
  },
  xml: {
    fetch: {
      url: 'task_rest',
      task: {
        params: 'eq.',
        value: 'make_xml'
      },
    },
    task: {
      url: "/reestr/xml/pack",
      get: "/utils/file/reestr/xml/",
      confirm: _mo,
      form: {
        legend: "Параметры реестра",
        month: $month,
        pack: {
          label: ["Номер пакета"],
          type: "number",
          tag: ['.fname', 'required'],
          attrs: { min: 1, 'data-initial': 1 }
        },
        sent: {
          label: ["Отметить отправленные", '.pure-checkbox'],
          type: "checkbox",
          view: 'controls'
        },
        fresh: {
          label: ["Не отправлять принятые", '.pure-checkbox'],
          type: "checkbox",
          view: 'controls'
        },
      },
      buttons: {
        but1: {
          label: ["Сформировать"], type: 'submit',
          tag: ['.pure-button.pure-button-primary'],
          attrs: $button_attrs
        }
      }
    },
    item: {
      name: "Сформировать",
      header: "Формируем XML пакет для ФОМС"
    }
  }
}

export const pack = {
  path: '/pack/:item',
  name: "Пакеты",
  def: reestrPack,
  items: ['test', 'xml']
};