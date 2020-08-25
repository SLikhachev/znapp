
// src/sprav/router/roProf.js

import { disp } from '../../apps/appApi';
import { vuPage } from '../../apps/appRouter';
import { talons } from '../defines/defTalons';
import { vuClinicList } from '../view/vuClinicList';
//import { vuCard } from '../view/vuCard';

export const roTalons = () => ({
  [talons.path]: {
    onmatch() {
      disp(['suite', talons.def, 'talons']);
      return vuClinicList;
    },
    render(vnode) { return vuPage(vnode); },
  },
  
  [talons.path + '/:crd' + '/:tal']: {
    onmatch(args) {
      const { crd, tal } = args;
      /*
      if (!Number.isSafeInteger(Number(tal))) {
        console.warn('invalid talon number -- ', crd);
        return m.route.SKIP;
      }
      */
      disp(['talon', talons.def, crd, tal]);
      return vuClinicTabs;
    },
    render(vnode) { return vuPage(vnode); }
  },
});
