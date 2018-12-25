
// src/sparv/spravApi.js
// here url is a table name
restSprav = {
    // local
    district: { url:"district"},
    division: { url:"division"},
    mo_local: { url:"mo_local"},
    smo_local: { url:"smo_local"},
    get doctor() {
        return { url:"doctor", options: [ this.division, this.district ], sort_by: 'code' };
    },
    // tfoms
    doc_spec : { url:"doc_spec"},
    sp_podr: { url:"sp_podr", sort_by: 'mo_code' },
    sp_para: { url:"sp_para"},
    purp: { url: 'purpose'},
    type: {url: 'spec_case'},
    insur: {url: 'kategor'},
    istfin: {url: 'ist_fin'},
    errors: {url: 'errors_code'},
    // onko
    onko_n1: {url: 'n1_protkaz'},
    onko_n2: {url: 'n2_stady'},
    onko_n3: {url: 'n3_tumor'},
    onko_n4: {url: 'n4_nodus'},
    onko_n5: {url: 'n5_metastaz'},
    onko_n6: {url: 'rpc/onko_tnm'}, //pg base proc
    onko_n7: {url: 'n7_hystolog'},
    onko_n8: {url: 'onko_hysto_n8'}, // pg base view
    onko_n9: {url: 'onko_hysto_n9'}, // pg_base view
    onko_n10: {url: 'n10_mark'},
    onko_n11: {url: 'onko_mark_n11'}, // pg base view
    onko_n12: {url: 'onko_mark_n12'}, // pg base view
    onko_n13: {url: 'n13_lech_type'},
    onko_n14: {url: 'n14_hirlech_type'},
    onko_n15: {url: 'n15_leklech_line'},
    onko_n16: {url: 'n16_leklech_cycle'},
    onko_n17: {url: 'n17_luchlech_type'},
    onko_n18: {url: 'n18_povod_obras'},
    onko_n19: {url: 'n19_consil_cel'},
    //onko_n21: {url: 'rpc/onko_lek_schema'}, //pg base proc

    // types
    dul: {url: 'dul'},
    
}

const spravApi = {
    root: "/",
    mo: "/mo",
    mo_doct: "/mo/doct-list",
    mo_dist:  "/mo/dist-list",
    mo_divs: "/mo/divs-list",
    mo_local: "/mo/mo-local",
    mo_smo: "/mo/smo-local",
    //
    tfoms: "/tfoms",
    tfoms_spec: "/tfoms/spec",
    tfoms_podr: "/tfoms/podr",
    tfoms_para_podr: "/tfoms/para_podr",
    tfoms_purp: "/tfoms/purp",
    tfoms_type: "/tfoms/type",
    tfoms_insur: "/tfoms/insur",
    tfoms_istfin: "/tfoms/istfin",
    tfoms_errors: "/tfoms/errors",
    //
    onko: "/onko",
    onko_n1: "/onko/n1",
    onko_n2: "/onko/n2",
    onko_n3: "/onko/n3",
    onko_n4: "/onko/n4",
    onko_n5: "/onko/n5",
    //onko_n6: "/onko/n6",
    onko_n7: "/onko/n7",
    onko_n8: "/onko/n8",
    onko_n9: "/onko/n9",
    onko_n10: "/onko/n10",
    onko_n11: "/onko/n11",
    onko_n12: "/onko/n12",
    onko_n13: "/onko/n13",
    onko_n14: "/onko/n14",
    onko_n15: "/onko/n15",
    onko_n16: "/onko/n16",
    onko_n17: "/onko/n17",
    onko_n18: "/onko/n18",
    onko_n19: "/onko/n19",
    //onko_n21: "/onko/n21",
    /*
    spec: "/spec",
    other: "/other",
    tarif: "tarif",
   
    */
}

const spravMenu = { subAppMenu: {
  
  mo: {
    nref: [`#!${spravApi.mo}`, "Локальные"],
    items: [
      [`#!${spravApi.mo_doct}`, "Врачи"],
      [`#!${spravApi.mo_dist}`, "Участки"],
      [`#!${spravApi.mo_divs}`, "Отделения"],
      [`#!${spravApi.mo_local}`, "МО локальные"],
      [`#!${spravApi.mo_smo}`, "СМО локальные"],
    ]
  },
  tfoms: {
    nref: [`#!${spravApi.tfoms}`, "ТФОМС"],
    items: [
      [`#!${spravApi.tfoms_spec}`, "Специальности"],
      [`#!${spravApi.tfoms_podr}`, "Подразделения"],
      [`#!${spravApi.tfoms_para_podr}`, "Доп. службы"],
      [`#!${spravApi.tfoms_purp}`, "Цель обращения"],
      [`#!${spravApi.tfoms_type}`, "Особый случай"],
      [`#!${spravApi.tfoms_insur}`, "Категория ОМС"],
      [`#!${spravApi.tfoms_istfin}`, "Фин. источник"],
      [`#!${spravApi.tfoms_errors}`, "Причины отказов"],
    ]
  },
  onko: {
    nref: [`#!${spravApi.onko}`, "Онкология"],
    items: [
      [`#!${spravApi.onko_n1}`, "1. Причины отказов"],
      [`#!${spravApi.onko_n2}`, "2. Стадии"],
      [`#!${spravApi.onko_n3}`, "3. Tumor"],
      [`#!${spravApi.onko_n4}`, "4. Nodus"],
      [`#!${spravApi.onko_n5}`, "5. Метазстазы"],
      //[`#!${spravApi.onko_n6}`, "6. DS TNM"],
      [`#!${spravApi.onko_n7}`, "7. Гистология"],
      [`#!${spravApi.onko_n8}`, "8. Гистолог результ"],
      [`#!${spravApi.onko_n9}`, "9. Гистолог диагноз"],
      [`#!${spravApi.onko_n10}`, "10. Онкомаркеры"],
      [`#!${spravApi.onko_n11}`, "11. Онкомарк знач"],
      [`#!${spravApi.onko_n12}`, "12. Онкомарк диаг"],
      [`#!${spravApi.onko_n13}`, "13. Тип лечения"],
      [`#!${spravApi.onko_n14}`, "14. Хирург лечение"],
      [`#!${spravApi.onko_n15}`, "15. Лекарств линии"],
      [`#!${spravApi.onko_n16}`, "16. Лекарств циклы"],
      [`#!${spravApi.onko_n17}`, "17. Лучевая терапия"],
      [`#!${spravApi.onko_n18}`, "18. Повод обращения"],
      [`#!${spravApi.onko_n19}`, "19. Цель консилиума"],
      //[`#!${spravApi.onko_n21}`, "21. Схема терапии"],
    ]
  },
  
  /*
  spec: {
    nref: [`#!${spravApi.foms}`, "Врачебные"],
    items: [
      [`#!${spravApi.foms_mo}`, "МО Приморский край"],
      [`#!${spravApi.mo_dist}`, "Участки"],
      [`#!${spravApi.mo_divs}`, "Отделения"]
    ]
  },
  
  */
  }
}


export { restSprav, spravApi, spravMenu };