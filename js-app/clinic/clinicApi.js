
// src/clinic/clinicApi.js

export const restClinic = {

    cards_cnt: { url:"count_cards_clin", method:"GET" }, 
    card_find: { url:"rpc/clin_cards", method:"POST" },
    get_card: { url:"rpc/clin_card_by_num", method:"POST"},
    get_crd_talons: {url: 'rpc/clin_crd_talons', method: 'POST'},

    talons_cnt: { url:"count_talons_clin", method:"GET" }, 
    talon_find: { url:"rpc/clin_talons", method:"POST"},
    get_talon: { url:"rpc/clin_talon_by_num", method:"POST"},

    get_pmu: { url:"rpc/get_tal_pmu", method:"POST"},
    para_clin: { url: "para_clin"},
};

export const clinicApi = {
    root: "/",
    cards: "/cards",
    card_id: "/cards/:crd",
    card_add:"/cards/0", // maybe /cards/0
    talons: "/talons",
    talon_id: "/talons/:tal/:crd",
    talon_add: "/talons/0/" //crd adds by click event
};

export const clinicMenu = { subAppMenu: {

  cards: {
    nref: [ `#!${clinicApi.cards}`, "Карты"],
  },

  talons: {
    nref: [`#!${clinicApi.talons}`, "Визиты"],
  },

}
};
