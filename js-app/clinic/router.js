
// src/reestr/router.js

import { states } from '../apps/appApi'
import { pageView, pathRouter, routerFun } from '../apps/appRouter';

// init func
import { initClinic } from './clinicApi';

// menu
import { clinicMenu } from './clinicMenu';

// routers
import { roCards } from './router/roCards';
import { roTalons } from './router/roTalons';

const route = pathRouter(pageView(states));
const addroute = { cards: roCards, talons: roTalons }; //functions
const Router = routerFun(clinicMenu, addroute, route);

// init application
initClinic();
m.route(document.body, "/", Router);

