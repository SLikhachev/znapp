
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
  /*
  [cards.path + '/:crd']: {
    onmatch(args) {
      const { crd } = args;
      /*
      if (!Number.isSafeInteger(Number(crd))) {
        console.warn('invalid card number -- ', crd);
        return m.route.SKIP;
      }
      *//*
      disp(['card', cards.def, crd]);
      return vuCard;
    },
    render(vnode) { return vuPage(vnode); }
  },
  */
});
