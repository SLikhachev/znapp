// src/sprav/router_sprav.js

import { vuApp } from '../apps/view/vuApp.js';
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
    render() { 
       return vuSprav( m(vuApp, { text: "Медстатистика: Справочники" }) );
    }
  }
};

Object.assign(spravRouter, roLocal, roProf, roCom, roTarif); //roOnko);

//m.route(document.getElementById('content'), "/", {})
m.route(document.body, "/", spravRouter);
