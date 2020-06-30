
// src/reestr/router.js

import { pathRouter, routerFun } from '../apps/appRouter';

//  init func
import { initReestr } from './reportApi';

//menu
import { reestrMenu } from './reportMenu';

// adds routers
//import { ro } from './router/ro';

// views
import { vuTaskSheet } from './view/vuTaskSheet';

const route = pathRouter(vuTaskSheet);
const addroute = {}; //{ pmus: roPmus }; //functions
const Router = routerFun(reestrMenu, addroute, route);

// init application
initReestr();
m.route(document.body, "/", Router);

