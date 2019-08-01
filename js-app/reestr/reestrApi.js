
// src/reestr/reestrApi.js

export const taskReestr = {
    
    dbf: {
        post_url: "/reestr/import/reestr", //POST date, upload file
    },
    invoice: {},

}

export const reestrApi = {
    root: "/",
    
    reestr: "/reestr",
    reestr_xml: "/reestr/xml",
    
    invoice: "/invoice",
    invoice_exp: "/invoice/exp",
    
    _import: "/import",
    dbf_imp: "/import/dbf",

};

export const reestrMenu = { subAppMenu: {
  
  reestr: {
    nref: [`#!${reestrApi.reestr}`, "Пакеты"],
    items: [
      [`#!${reestrApi.reestr_xml}`, "XML для ФОМС"],
    ]
  },
  invoice: {
    nref: [`#!${reestrApi.invoice}`, "Счета"],
    items: [
      [`#!${reestrApi.invoice_exp}`, "XML в XLSX"],
    ]
  },
  _import: {
    nref: [`#!${reestrApi._import}`, "Импорт"],
    items: [
      [`#!${reestrApi.dbf_imp}`, "Файлы реестров (DBF)"],
    ]
  }
}
};
