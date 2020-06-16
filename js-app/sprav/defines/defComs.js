
// src/sparv/model/spravCom.js
// common sprav definition

export const spravComs = {

  page: "Общие справочники",

  dul: {
    item: {
      name: "ДУЛ",
      header: "Документ удостоверяющий личнось",
      struct: {
        code: ["Код", 'sort'],
        name: ["Наименование"],
        serial_tpl: ["Шаблон серии"],
        number_tpl: ["Шаблон номера"]
      }
    }
  },
  okato: {
    item: {
      name: "OKATO",
      struct: {
        okato: ["ОКАТО", 'sort'],
        region: ["Код региона", 'sort'],
        name: ["Наименование региона"]
      },
    }
  },
}

export const coms = {
  path: '/coms/:item',
  name: "Общие",
  def: spravComs,
  items: ['dul', 'okato']
};