// src/report/router.js

import { pathRouter, routerFun } from '../apps/appRouter';
import { vuTaskSheet } from '../apps/view/vuTaskSheet';

//  init func
import { initReport } from './reportApi';

//menu
import { reportMenu } from './reportMenu';

// adds routers
//import { ro } from './router/ro';
// views

const route = pathRouter(vuTaskSheet);
const addroute = {}; //{ pmus: roPmus }; //functions
const Router = routerFun(reportMenu, addroute, route);

// init application
initReport();
m.route(document.body, "/", Router);
