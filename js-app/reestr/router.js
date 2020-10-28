
// src/reestr/router.js

import { pathRouter, routerFun } from '../apps/appRouter';
// views
import { vuTaskSheet } from '../apps/view/vuTaskSheet';

// init func
import { initReestr } from './reestrApi';

// menu
import { reestrMenu } from './reestrMenu';

// adds routers
//import { ro } from './router/ro';

const route = pathRouter(vuTaskSheet);
const addroute = {};
const Router = routerFun(reestrMenu, addroute, route);

// init application
initReestr();
m.route(document.body, "/", Router);

