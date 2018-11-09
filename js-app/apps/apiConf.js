// apps/apiConf.js

//const moName = "Поликлиника №4";

const appMenu = { // routing by Django
  clinic : { href: "#", name: "Клиника"},
  travm: { href: "#", name: "Травма"},
  stom: { href: "#", name: "Стоматолог"},
  sprav: { href: "/sprav", name: "Справочники"},
  reestr: { href: "/reestr", name: "Реестры" },
  report: { href: "/report", name: "Отчеты"}
}

//const schemaRest = 'http://localhost:3000/'

//export { moName, appMenu, schemaRest };
export { appMenu };