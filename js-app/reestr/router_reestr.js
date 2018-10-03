// src/reestr/router_reestr.js

// common
import { vuMain } from '../apps/view/vuMain.js';
import { reestrApi, reestrMenu } from './resstrApi.js';
import { vuReestr } from './view/vuReestr.js';

import { vuImports } from './view/vuImports.js'

m.route(document.body, "/", {
  [reestrApi.root]: {
    render: function() {
      return m(vuMain, reestrMenu,
        m(vuClinic, { text: "Медстатистика: Реестры ОМС" }));
    }
  },
  [reestrApi.imports] : {
    render : function() {
        return m(vuMain, reestrMenu, m(vuImports) );
      }
  },

})

