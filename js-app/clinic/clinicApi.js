
// src/clinic/clinicApi.js

restApi = {

    cards_cnt: { url:"get_cards_count", method:"GET" }, 
    card_find: { url:"rpc/get_cards", method:"POST" },
    get_card: { url:"rpc/get_card_by_num", method:"POST"},
    
    talons_cnt: { url:"get_talons_count", method:"GET" }, 
    talon_find: { url:"rpc/get_talons", method:"POST"},
    get_talon: { url:"rpc/get_talon_by_num", method:"POST"},
    
}

const clinicApi = {
    root: "/",
    cards: "/cards",
    card_id: "/cards/:id",
    talons: "/talons",
    talon_id: "/talons/:id"
}

const clinicMenu = { subAppMenu: {
  
  talons: {
    nref: [`#!${clinicApi.talons}`, "Талоны"],
  },
    cards: { 
    nref: [ `#!${clinicApi.cards}`, "Карты"],
  },
}
}

export { restApi, clinicApi, clinicMenu };