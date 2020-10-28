
// src/reestr/defines/defReestr.js
// packages definition

import { $month, $checkbox, $button } from '../../apps/defines/defStruct';
import { _mo } from '../../apps/model/moModel';
import { linkCard, linkTalon } from './defLinks';

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
      buttons: { but1: $button("Прверить") },
    },
    item: {
      name: "Проверить",
      header: "Проверяем талоны",
      struct: {
        tal_num: ['Талон', '', linkTalon],
        crd_num: ['Карта', '', linkCard],
        error: ['Ошибка']
      }
    },
  },
  xml: {
    count: {
      rest: {
        url: 'task_rest',
        params: { task: 'eq.make_xml' }
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
        sent: $checkbox("Отметить отправленные"),
        fresh: $checkbox("Не отправлять принятые"),
      },
      buttons: { but1: $button("Сформировать") }
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