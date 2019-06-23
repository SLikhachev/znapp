// src/clinic/router_clinic.js

// common
import { vuMain } from '../apps/view/vuMain.js';
import { clinicApi, clinicMenu } from './clinicApi.js';
import { vuClinic } from './view/vuClinic.js';

// cards
import { moCard } from './model/moCards.js';
import { vuCardsList } from './view/vuCardsList.js';
import { vuCard } from './view/vuCard.js';
// talons
import { moTalon } from './model/moTalons.js';
import { vuTalonsList } from './view/vuTalonsList.js';
import { vuTalon } from './view/vuTalon.js';

//m.route(document.getElementById('content'), "/", {
m.route(document.body, "/", {
  [clinicApi.root]: {
    render: function() {
      return m(vuMain, clinicMenu,
        m(vuClinic, { text: "Медстатистика: Поликликлиника" }));
    }
  },
  [clinicApi.cards] : {
    render : function() {
        return m(vuMain, clinicMenu, m(vuCardsList) );
      }
  },
  
  [clinicApi.card_id] : {
    onmatch: function(args) {
      
      moCard.clear();
      //actionsCard.clear({}): // initial state
      //let { crd } = args;
      // TODO card number may be not an Int but any string
      //if ( !isNaN(parseInt(id) ) )  moCard.getCard(args); //tionsCard.get(args); //
      if ( !Boolean(moCard.data) ) moCard.getOptions();
      moCard.getCard(args);
      //console.log(args);
      return vuCard;
    },
    render : function(vnode) {
        //console.log(vnode.attrs);
        return m(vuMain, clinicMenu, vnode );
      }
  },

  [clinicApi.talons] : {
    render : function() {
        return m(vuMain, clinicMenu, m(vuTalonsList) );
      }
  },
  [clinicApi.talon_id] : {
    onmatch: function(args) {
      moTalon.clear();
      //console.log(args);
      //let { tal, crd } = args;
      //if ( !isNaN(parseInt(id) ) )  moTalon.getTalon(args);
      if ( !Boolean(moTalon.data) ) moTalon.getOptions();
      moTalon.getTalon(args);
      return vuTalon;
    },
    render : function(vnode) {
        return m(vuMain, clinicMenu, vnode );
      }
  },
  
});

