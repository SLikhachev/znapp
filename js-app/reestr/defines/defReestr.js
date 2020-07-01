
// src/reestr/defines/defReestr.js
// common sprav definition

import { _month, _test } from '../../apps/defines/defStruct';
import { _mo } from '../../apps/model/moModel';

export const reestrPack = {

  page: "Проверка и Пакеты для ФОМС",

  test: {
    task: {
      url: "/reestr/xml/pack",
      form: {
        legend: "Параметры проверки",
        month: _month,
      },
      buttons: {
        butt1: {
          label: ["Прверить"], type: 'submit', tag: ['.pure-button'],
          attrs: { style: 'font-size: 1.2em; margin-top: 0.5em', method: 'POST' }
        },
      }
    },
    item: {
      name: "Проверить",
      header: "Проверяем талоны",
      struct: {
      },
    }
  },
  xml: {
    task: {
      url: "/reestr/xml/pack",
      get: "/utils/file/reestr/xml/",
      confirm: _mo,
      form: {
        legend: "Параметры реестра",
        month: _month,
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
          label: ["Сформировать"],
          type: 'submit',
          tag: ['.pure-button.pure-button-primary'],
          attrs: { style: "font-size: 1.2em; margin-top: 0.5em", method: 'POST' }
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