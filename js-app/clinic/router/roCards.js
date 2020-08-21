
// src/sprav/router/roProf.js

import { disp } from '../../apps/appApi';
import { vuPage } from '../../apps/appRouter';
import { cards } from '../defines/defCards';
import { vuClinicList } from '../view/vuClinicList';
import { vuCard } from '../view/vuCard';

export const roCards = () => ({
  [cards.path]: {
    onmatch() {
      disp(['suite', cards.def, 'cards']);
      return vuClinicList;
    },
    render(vnode) { return vuPage(vnode); },
  },

  [cards.path + '/:crd']: {
    onmatch(args) {
      const { crd } = args;
      //console.log('match ', crd )
      /*
      if (!Number.isSafeInteger(Number(crd))) {
        console.warn('invalid card number -- ', crd);
        return m.route.SKIP;
      }
      */
      disp(['card', cards.def, crd]);
      return vuCard;
    },
    render(vnode) { return vuPage(vnode); }
  },
})
