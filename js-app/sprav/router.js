// src/sprav/router_sprav.js

import { vuPageTitle } from '../apps/view/vuMain';
// sprav
import { states } from './spravApi';
import { spravMenu } from './spravMenu';
import { vuSprav } from './view/vuSprav';
// routers
import { roRouter } from './router/roRouter'
import { roPmus } from './router/roPmus';
// path defines
import { local } from './defines/defLocal';
import { prof } from './defines/defProf';
import { coms } from './defines/defComs';
import { tarif } from './defines/defTarif';


const spravRouter = {
  [spravMenu.root]: {
    render() {
      return vuSprav(m(vuPageTitle, { text: states().suite.page }));
    }
  }
};


Object.assign(
  spravRouter,
  roRouter(local),
  roRouter(prof),
  roPmus,
  roRouter(coms),
  roRouter(tarif)
);


m.route(document.body, "/", spravRouter);
