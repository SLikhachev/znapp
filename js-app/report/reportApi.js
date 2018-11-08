
// src/report/reportApi.js

const pgRest = {
    volum: 'p146_report?insurer=eq.999&order=this_month.asc',
}

const restApi = {
    
    hosp: {
        post_url: "/report/common/hosp/make_report", //POST date, upload file
        get_url: "/utils/file/hosp/report/", //GET report file
    },
    volum: {
        post_url: "/report/common/volum/make_report", //POST date
        get_url: "/utils/file/volum/report/" //GET report file
    },

}

const appApi = {
    root: "/",
    surv: "/surv",
    surv_hosp: "/surv/hosp",
    surv_volum: "/surv/volum",
}

const appMenu = { subAppMenu: {
  
  surv: {
    nref: [`#!${appApi.surv}`, "Сводные"],
    items: [
      [`#!${appApi.surv_hosp}`, "Госпитализация ЕИР"],
      [`#!${appApi.surv_volum}`, "Объемы помощи"],
      
    ]
  }
}
}


export { pgRest, restApi, appApi, appMenu };