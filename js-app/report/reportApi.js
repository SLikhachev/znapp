
// src/report/reportApi.js

export const restReport = {
    volum: {
      url: 'p146_report',
      params: {insurer: 'eq.999', this_year: 'eq.2020', order: 'this_month' }
    }
}

export const taskReport = {
    
    hosp: {
        post_url: "/report/common/hosp/make_report", //POST date, upload file
        get_url: "/utils/file/hosp/report/", //GET report file
    },
    volum: {
        post_url: "/report/common/volum/make_report", //POST date
        get_url: "/utils/file/volum/report/" //GET report file
    },

}

export const reportApi = {
    root: "/",
    surv: "/surv",
    surv_hosp: "/surv/hosp",
    surv_volum: "/surv/volum",
}

export const reportMenu = { subAppMenu: {
  
  surv: {
    nref: [`#!${reportApi.surv}`, "Сводные"],
    items: [
      [`#!${reportApi.surv_hosp}`, "Госпитализация ЕИР"],
      [`#!${reportApi.surv_volum}`, "Объемы помощи"],
      
    ]
  }
}
}
