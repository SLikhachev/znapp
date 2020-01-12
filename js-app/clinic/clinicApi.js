
// src/clinic/clinicApi.js

export const restClinic = {

    cards_cnt: { url:"rpc/get_crd_count", method:"POST" }, 
    card_find: { url:"rpc/cards_list", method:"POST" },
    get_card: { url:"rpc/clin_card_by_num", method:"POST"},
    get_crd_talons: {url: 'rpc/crd_talons', method: 'POST'},
    
    //talons_cnt: { url:"count_talons_clin", method:"GET" }, 
    talons_cnt: { url:"rpc/get_tal_count", method:"POST" }, 
    talon_find: { url:"rpc/talons_list", method:"POST"},
    get_talon: { url:"rpc/get_talon_by_num", method:"POST"},

    get_pmu: { url:"rpc/get_tal_pmu", method:"POST"},
    // now current polis in talon inclided
    //get_polis: { url:"rpc/get_tal_polis", method: "POST" },
    para_clin: { url: "para_clin"},
    // talons templates
    get_talon_tpls: { url: "talonz_clin_tpl?select=tal_num,crd_num", order_by: "tal_num" },
    talon_tpls_list: { url: "talonz_clin_tpl?talon_type=gt.0", order_by: "tal_num"},
    talonz_clin_tpl: { url: "talonz_clin_tpl?tal_num=eq.", order_by: "tal_num"}

};

export const clinicApi = {
    root: "/",

    cards: "/cards",
    card_id: "/cards/:crd",
    card_add:"/cards/0", // maybe /cards/0

    talons: "/talons",
    talon_id: "/talons/:tal/:crd",
    talon_add: "/talons/0/", //crd adds by click event

    talons_tpl: "/talons_tpl",
    tal_tpl_id : "/talons_tpl/:tpl",
    tal_tpl_add : "/talons_tpl/:0",
};

export const clinicMenu = { subAppMenu: {

  cards: {
    nref: [ `#!${clinicApi.cards}`, "Карты"],
  },

  talons: {
    nref: [`#!${clinicApi.talons}`, "Визиты"],
  },

  talons_tpl:  {
      nref: [`#!${clinicApi.talons_tpl}`, "Шаблоны"]
  }
}
};
