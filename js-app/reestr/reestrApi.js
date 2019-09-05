
// src/reestr/reestrApi.js

export const taskReestr = {
    // POST request for calculat, GET for download files
    impo_dbf: {
        post_url: "/reestr/import/dbf", //POST date, upload file
    },
    pack: {
      post_url: "/reestr/xml/pack",
      get_url: ""
    },
    vmx: {
      post_url: "/reestr/xml/vmx",
      get_url: "/utils/file/reestr/vmx/", //GET report file  
    },
    invoice: {
      post_url: "/reestr/inv/impex",
      get_url: "/utils/file/reestr/inv/" //GET reestr file  
    },
    calc:{
        post_url: "/reestr/inv/calc",
        get_url: "/utils/file/reestr/inv/" //GET reestr file  
    }

}

export const restReestr = {
    vmx: { url:"vmx_errors", params: { limit: 50 } }
}
   

export const reestrApi = {
    root: "/",
    
    pack: "/pack",
    pack_xml: "/pack/xml",
    
    vmxl: "/vmxl",
    vmxl_imp: "/vmxl/imp",
    vmxl_last: "/vmxl/last",
    
    invoice: "/invoice",
    inv_impex: "/invoice/impex",
    inv_calc: "/invoice/calc",
    
    impo: "/impo",
    impo_dbf: "/impo/dbf",

};

export const reestrMenu = { subAppMenu: {
  
  pack: {
    nref: [`#!${reestrApi.pack}`, "Пакеты"],
    items: [
      [`#!${reestrApi.pack_xml}`, "Сформировать"],
    ]
  },
  vmxl: {
    nref: [`#!${reestrApi.vmxl}`, "Ошибки"],
    items: [
      [`#!${reestrApi.vmxl_imp}`, "Импорт ошибок"],
      [`#!${reestrApi.vmxl_last}`, "Показать последние"],
    ]
  },
  
  invoice: {
    nref: [`#!${reestrApi.invoice}`, "Счета"],
    items: [
      [`#!${reestrApi.inv_impex}`, "Реестр в СМО"],
      [`#!${reestrApi.inv_calc}`, "Рассчеты"],
    ]
  },
  impo: {
    nref: [`#!${reestrApi.impo}`, "Импорт"],
    items: [
      [`#!${reestrApi.impo_dbf}`, "Файлы реестров (DBF)"],
    ]
  }
}
};
