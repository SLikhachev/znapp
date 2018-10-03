// apps/apiConf.js

const moName = "Поликлиника №4";

const appMenu = { // routing by Flask
  clinic : { href: "#", name: "Клиника"},     
  sprav: { href: "/sprav", name: "Справочники"},
  reports: { href: "#", name: "Отчеты"}
}

const schemaRest = 'http://localhost:3000/'

export { moName, appMenu, schemaRest };