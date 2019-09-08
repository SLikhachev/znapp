// src/sprav/router_sprav.js

import { vuMain } from '../apps/view/vuMain.js';
// sprav
import { spravApi, spravMenu } from './spravApi.js';
import { vuSprav } from './view/vuSprav.js';
// routers
import { roLocal } from './router/roLocal.js';
import { roProf } from './router/roProf.js';
import { roCom } from './router/roCom.js';
//import { roOnko } from './router/roOnko.js';
import { roTarif } from './router/roTarif.js';

const spravRouter = { [spravApi.root]: {
    render: function() {
       return m(vuMain, spravMenu,
          m(vuSprav, { text: "Медстатистика: Справочники" }));
    }
  }
};

Object.assign(spravRouter, roLocal, roProf, roCom, roTarif); //roOnko);

//m.route(document.getElementById('content'), "/", {})
m.route(document.body, "/", spravRouter);
