// src/clinic/router_clinic.js

// common
import { vuMain } from '../apps/view/vuMain.js';
import { clinicApi, clinicMenu } from './clinicApi.js';
import { vuClinic } from './view/vuClinic.js';

// cards
import { moCard, cardOpt } from './model/moCards.js';
import { vuCardsList } from './view/vuCardsList.js';
import { vuCard } from './view/vuCard.js';
// talons
import { moTalon, talonOpt } from './model/moTalons.js';
import { vuTalonsList } from './view/vuTalonsList.js';
import { vuTalon } from './view/vuTalon.js';
import { vuTalonsTpl }  from './view/vuTalonsTpl.js';

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
      if ( cardOpt.data.size === 0 ) cardOpt.getOptions();
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
      if ( talonOpt.data.size === 0 ) talonOpt.getOptions();
      //moTalon.getTalon(args);
      return vuTalon;
    },
    render : function(vnode) {
        return m(vuMain, clinicMenu, vnode );
      }
  },

  [clinicApi.talon_tpl]: {
    render : function() {
        return m(vuMain, clinicMenu, m(vuTalonsTpl) );
      }
  },
  }
});

