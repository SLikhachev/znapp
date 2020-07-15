
// src/sprav/router/roProf.js

import { disp } from '../../apps/appApi';
import { vuPage } from '../../apps/appRouter';
import { cards } from '../defines/defCards';
import { vuCardsList } from '../view/vuCardsList';
//import { vuCard } from '../view/vuCard';

export const roCards = () => ({
  [cards.path]: {
    render() {
      disp(['suite', cards.def, 'cards']);
      return vuPage(m(vuCardsList));
    },
  },
  /*
  [cards.path + '/:crd']: {
    onmatch(args) {
      const { crd } = args;
      if (!Number.isSafeInteger(Number(crd)))
        m.route.SKIP;
      //disp(['card', cards.def, crd]);
      m.route.SKIP;
      //return vuCard;
    },
    render(vnode) { return vuPage(vnode); }
  },*/
})
