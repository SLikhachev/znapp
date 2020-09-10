
// src/reestr/router.js

import { states, app } from '../apps/appApi';
import { pageView, pathRouter, routerFun } from '../apps/appRouter';

// init func
import { initClinic } from './clinicApi';

// menu
import { clinicMenu } from './clinicMenu';

// routers
//import { roCards } from './router/roCards';
//import { roTalons } from './router/roTalons';
import { clinicRouter } from './router/roClinic';

//const router = pathRouter(pageView(states));
//const addroute = { cards: roCards, talons: roTalons }; //functions
//const Router = routerFun(clinicMenu, addroute, route);
const Router = routerFun(clinicMenu, {}, clinicRouter);

// init application
if (!app.inited)
  initClinic();
m.route(document.body, "/", Router);

