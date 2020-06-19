// src/sprav/router.js

import { app } from '../apps/appApi';
import { pathRouter, routerFun } from '../apps/appRouter';

//  init func
import { initApp } from './spravApi';

//menu
import { spravMenu } from './spravMenu';

// adds routers
import { roPmus } from './router/roPmus';

// views
import { vuSheet } from './view/vuSheet';

// init application
initApp(app);

const route = pathRouter(vuSheet);
const addroute = { pmus: roPmus }; //functions
const spravRouter = routerFun(spravMenu, addroute, route);

m.route(document.body, "/", spravRouter);
