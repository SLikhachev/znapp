
// src/sparv/model/spravCom.js
// common sprav definition



export const reportSurvey = {

  page: "Отчеты сводные",

  volum: {
    rest: {
      url: 'p146_report',
      params: { insurer: 'eq.999', this_year: 'eq.2020', order: 'this_month' }
    },
    task: {
      post: "/report/common/volum/make_report", //POST date
      get: "/utils/file/volum/report/" //GET report file
    },
    item: {
      name: "Объемы помощи",
      header: "Обемы помощи приказ 146",
      struct: {
        this_month: ["Месяц", get_month],
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
      post: "/report/common/hosp/make_report", //POST date, upload file
      get: "/utils/file/hosp/report/", //GET report file
    },
    item: {
      name: "Госпитализация ЕИР",
      header: "Госпитализация отчет из файда ЕИР"
    }
  }
}


export const surv = {
  path: '/surv/:item',
  name: "Сводные",
  def: reportSurv,
  items: ['volum']//, 'hosp']
};