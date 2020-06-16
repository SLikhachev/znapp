
// src/sparv/model/spravOnko.js
// onkology sprav definition

const onko_ = function () {
  return {
    id: ["Индекс"],
    ds: ["Диагноз", true],
    kod: ["Код", true],
    name: ["Наименование"]
  };
};
/*
onko: {
  nref: [`${spravApi.onko}`, "Онкология"],
    items: [
      [`${spravApi.onko_n1}`, "1. Причины отказов"],
      [`${spravApi.onko_n2}`, "2. Стадии"],
      [`${spravApi.onko_n3}`, "3. Tumor"],
      [`${spravApi.onko_n4}`, "4. Nodus"],
      [`${spravApi.onko_n5}`, "5. Метазстазы"],
      //[`${spravApi.onko_n6}`, "6. DS TNM"],
      [`${spravApi.onko_n7}`, "7. Гистология"],
      [`${spravApi.onko_n8}`, "8. Гистолог результ"],
      [`${spravApi.onko_n9}`, "9. Гистолог диагноз"],
      [`${spravApi.onko_n10}`, "10. Онкомаркеры"],
      [`${spravApi.onko_n11}`, "11. Онкомарк знач"],
      [`${spravApi.onko_n12}`, "12. Онкомарк диаг"],
      [`${spravApi.onko_n13}`, "13. Тип лечения"],
      [`${spravApi.onko_n14}`, "14. Хирург лечение"],
      [`${spravApi.onko_n15}`, "15. Лекарств линии"],
      [`${spravApi.onko_n16}`, "16. Лекарств циклы"],
      [`${spravApi.onko_n17}`, "17. Лучевая терапия"],
      [`${spravApi.onko_n18}`, "18. Повод обращения"],
      [`${spravApi.onko_n19}`, "19. Цель консилиума"],
      //[`#!${spravApi.onko_n21}`, "21. Схема терапии"],
    ]
},

onko_n6: {
    ds_code: ['Диагноз'],
    stady_id: ['Код Стадия'],
    //st_kod: ['Стадия'],
    tumor_id: ['Код Tumor'],
    //tm_kod: ['Tumor'],
    nodus_id: ['Код Nodus'],
    //nd_kod: ['Nodus'],
    metas_id: ['Код Метастаз'],
    //meta_kod:['Метастаз']
  },
  onko_n8: {
    id: ["Индекс"], 
    hysto_name: ["Наименование гистологии"], 
    hysto_id: ["Индекс гистологии"],
    name: ["Результат"]
  },
  onko_n9: {
    id: ["Индекс"], 
    ds: ["Диагноз"],
    hysto_name: ["Наименование гистологии"], 
    hysto_id: ["Индекс гистологии"],
  },
  onko_n10: {
    id: ["Индекс"], 
    kod: ["Код"],
    name: ["Наименование"]
  },
  onko_n11: {
    id: ["Индекс"], 
    mark_name: ["Наименование маркера"],
    mark_id: ["Индекс маркера"],
    kod: ["Код"],
    name: ["Результат"]
  },
  onko_n12: {
    id: ["Индекс"], 
    ds: ["Диагноз"],
    mark_name: ["Наименование маркера"],
    mark_id: ["Индекс маркера"],
  },

*/

export const spravOnko = {
  // onko
  n1_protkaz: { item: { name: "1. Причины отказов" } },
  n2_stady: {
    item: {
      name: "2. Стадии",
      struct: {
        id: ["Индекс"],
        ds: ["Диагноз", true],
        kod: ["Код", true]
      }
    }
  },
  n3_tumor: { item: { name: "3. Tumor", struct: onko_() } },
  n4_nodus: { item: { name: "4. Nodus", struct: onko_() } },
  n5_metastaz: { item: { name: "5. Метазстазы", struct: onko_() } },
  //onko_n6: { url: 'rpc/onko_tnm' }, //pg base proc
  n7_hystolog: {},
  onko_n8: { url: 'onko_hysto_n8' }, // pg base view
  onko_n9: { url: 'onko_hysto_n9' }, // pg_base view
  onko_n10: { url: 'n10_mark' },
  onko_n11: { url: 'onko_mark_n11' }, // pg base view
  onko_n12: { url: 'onko_mark_n12' }, // pg base view
  onko_n13: { url: 'n13_lech_type' },
  onko_n14: { url: 'n14_hirlech_type' },
  onko_n15: { url: 'n15_leklech_line' },
  onko_n16: { url: 'n16_leklech_cycle' },
  onko_n17: { url: 'n17_luchlech_type' },
  onko_n18: { url: 'n18_povod_obras' },
  onko_n19: { url: 'n19_consil_cel' },
  //onko_n21: {url: 'rpc/onko_lek_schema'}, //pg base proc
}
