// src/sprav/router.js

import { pathRouter, routerFun } from '../apps/appRouter';

//  init func
import { initSparv } from './spravApi';

//menu
import { spravMenu } from './spravMenu';

// adds routers
import { roPmus } from './router/roPmus';

// views
import { vuSheet } from './view/vuSheet';

const route = pathRouter(vuSheet);
const addroute = { pmus: roPmus }; //functions
const Router = routerFun(spravMenu, addroute, route);

initSparv();
m.route(document.body, "/", Router);
