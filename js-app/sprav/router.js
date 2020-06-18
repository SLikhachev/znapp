// src/sprav/router_sprav.js

import { rootRouter, pathRouter, app } from '../apps/appApi';
//  init func
import { initApp } from './spravApi';
//menu
import { spravMenu } from './spravMenu';
// adds routers
import { roPmus } from './router/roPmus';

// path defines
//import { local } from './defines/defLocal';
//import { prof } from './defines/defProf';
//import { coms } from './defines/defComs';
//import { tarif } from './defines/defTarif';
// views
import { vuSheet } from './view/vuSheet';

// init application
initApp(app);

const route = pathRouter(vuSheet);
const addroute = { pmus: roPmus }; //functions

const router = () => {
  let root = rootRouter, next;
  Object.keys(spravMenu).forEach(m => {
    if (m === 'root') return;
    if (!!spravMenu[m].router)
      next = addroute[m]();
    else
      next = route(spravMenu[m])
    Object.assign(root, next);
  });
  return root;
}
/*
Object.assign(
  rootRouter,
  route(local),
  route(prof),
  roPmus,
  route(coms),
  route(tarif)
);
*/
m.route(document.body, "/", router());
