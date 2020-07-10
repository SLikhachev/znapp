
// src/sprav/router/roProf.js

import { disp } from '../../apps/appApi';
import { cards } from '../defines/defCards';
import { vuCardsList } from '../view/vuCardsList';
import { vuCard } from '../view/vuCard';

export const roCards = () => ({
  [cards.path.split(':')[0]]: {
    render() {
      disp(['suite', cards.def]);
      return vuPage(m(vuCardsList));
    },
  },
  [cards.path]: {
    onmatch(args) {
      const { crd } = args;
      disp(['card', cards.def, crd]);
      return vuCard;
    },
    render(vnode) { return vuPage(vnode); }
  },
})
