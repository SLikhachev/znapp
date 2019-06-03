
// src/clinic/clinicApi.js

export const restClinic = {

    cards_cnt: { url:"count_cards_clin", method:"GET" }, 
    card_find: { url:"rpc/clin_cards", method:"POST" },
    get_card: { url:"rpc/clin_card_by_num", method:"POST"},
    
    talons_cnt: { url:"count_talons_clin", method:"GET" }, 
    talon_find: { url:"rpc/clin_talons", method:"POST"},
    get_talon: { url:"rpc/clin_talon_by_num", method:"POST"},
    
};

export const clinicApi = {
    root: "/",
    cards: "/cards",
    card_id: "/cards/:id",
    card_add:"/cards/add",
    talons: "/talons",
    talon_id: "/talons/:id",
};

export const clinicMenu = { subAppMenu: {
  
  talons: {
    nref: [`#!${clinicApi.talons}`, "Талоны"],
  },
  cards: { 
    nref: [ `#!${clinicApi.cards}`, "Карты"],
  },
}
};
