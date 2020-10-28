
// src/clinic/router.js

'use strict';

import { app } from '../apps/appApi';
import { routerFun } from '../apps/appRouter';

// init func
import { initClinic } from './clinicApi';

// menu
import { clinicMenu } from './clinicMenu';

// routers
import { clinicRouter } from './router/roClinic';

//const router = pathRouter(pageView(states));
//const addroute = { cards: roCards, talons: roTalons }; //functions
//const Router = routerFun(clinicMenu, addroute, route);
const Router = routerFun(clinicMenu, {}, clinicRouter);

// init application
if (!app.inited)
  initClinic();
m.route(document.body, "/", Router);

