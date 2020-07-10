
// src/sparv/model/spravCom.js
// common sprav definition

import {
  get_month, $month,
  $checkbox, $button
} from '../../apps/defines/defStruct';


export const reportSurv = {

  page: "Отчеты сводные",

  volum: {
    rest: {
      url: 'p146_report',
      params: { insurer: 'eq.999', this_year: 'eq.2020', order: 'this_month' }
    },
    task: {
      url: "/report/common/volum/make_report", // POST/GET data
      get: "/utils/file/volum/report/", //GET report file
      form: {
        legend: "Расчет объемов",
        month: $month,
        test: $checkbox("Тест")
      },
      buttons: {
        but1: R.assocPath(['tag'], ['.pure-button'], $button("Обновить")),
        but2: R.compose(
          R.assocPath(['attrs', 'style'], 'font-size: 1.2em; margin: 0.5em 0 0 2em;'),
          R.assocPath(['attrs', 'method'], 'GET'))
          ($button("Отчет"))
      }
    },
    item: {
      name: "Объемы помощи",
      header: "Обемы помощи приказ 146",
      struct: {
        this_month: ["Месяц", '', get_month],
        pol_ambul_visits: ["Амбул визиты"],
        pol_prof_visits: ["Проф визиты"],
        pol_stac_visits: ["Стац визиты"],
        pol_stom_uet: ["Стом УЕТ"],
        pol_ambul_persons: ["Амбул персон"],
        pol_prof_persons: ["Проф персон"],
        pol_stac_persons: ["Стац персон"],
        pol_stom_persons: ["Стом персон"],
        travma_ambul_visits: ["Травма визиты"],
        travma_ambul_persons: ["Травма персон"],
      },
    }
  },
  hosp: {
    task: {
      url: "/report/common/hosp/make_report", //POST data, upload file
      get: "/utils/file/hosp/report/", //GET report file
      form: {
        legend: "Отчет из файла ЕИР",
        file: { type: 'file' },
        month: $month,
        test: $checkbox("Тест")
      },
      buttons: { but1: $button("Загрузить") }
    },
    item: {
      name: "Госпитализация ЕИР",
      header: "Госпитализация отчет из файла ЕИР"
    }
  }
}

export const surv = {
  path: '/surv/:item',
  name: "Сводные",
  def: reportSurv,
  items: ['volum', 'hosp']
};