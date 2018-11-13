
// src/reestr/reestrApi.js

const pgRest = {
    //reestr: 'p146_report?insurer=eq.999&order=this_month.asc',
}

const taskApi = {
    
    reestr_imp: {
        post_url: "/reestr/import/reestr", //POST date, upload file
    },
    /*
    volum: {
        post_url: "/report/common/volum/make_report", //POST date
        get_url: "/utils/file/volum/report/" //GET report file
    },
    */
}

const appApi = {
    root: "/",
    import: "/import",
    reestr_imp: "/import/reestr",
    //surv_volum: "/surv/volum",
};

const appMenu = { subAppMenu: {
  
  import: {
    nref: [`#!${appApi.import}`, "Импорт"],
    items: [
      [`#!${appApi.reestr_imp}`, "Файлы реестров (DBF)"],
      //[`#!${appApi.surv_volum}`, "Объемы помощи"],
      
    ]
  }
}
};

export { pgRest, taskApi, appApi, appMenu };