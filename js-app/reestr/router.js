// src/report/router_report.js

import { app } from '../apps/appApi';
import { pathRouter, routerFun } from '../apps/appRouter';

//  init func
import { initApp } from './reportApi';

//menu
import { reestrMenu } from './reestrMenu';

// adds routers
//import { roPmus } from './router/roPmus';

// views
import { vuTaskSheet } from './view/vuTaskSheet';

// init application
initApp(app);

const route = pathRouter(vuTaskSheet);
const addroute = {}; //{ pmus: roPmus }; //functions
const spravRouter = routerFun(reportMenu, addroute, route);

m.route(document.body, "/", spravRouter);
