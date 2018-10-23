
// src/report/reportApi.js

restApi = {
    
    hosp: { url: "/utils/file/hosp/report/"},

}

const appApi = {
    root: "/",
    surv: "/surv",
    surv_hosp: "/surv/hosp",
}

const appMenu = { subAppMenu: {
  
  surv: {
    nref: [`#!${appApi.surv}`, "Сводные"],
    items: [
      [`#!${appApi.surv_hosp}`, "Госпитализация"],
    ]
  }
}
}


export { restApi, appApi, appMenu };