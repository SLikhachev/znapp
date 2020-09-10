
// src/sprav/router/roProf.js

import { disp } from '../../apps/appApi';
import { vuPage } from '../../apps/appRouter';
import { vuClinicList } from '../view/vuClinicList';
import { vuClinicTabs } from '../view/vuClinicTabs';

const unslash = string => string.toString().split('/')[1];

export const clinicRouter = menuItem => ({
  [menuItem.path]: {
    onmatch() {
      // path = '/cards' -> unit = 'cards' ;
      let unit = unslash( menuItem.path );
      disp(['suite', menuItem.def, unit]);
      return vuClinicList;
    },
    render(vnode) { return vuPage(vnode); },
  },

  [`${menuItem.path}${menuItem.item}`]: {
    onmatch(args) {
      //const { card } = args;
      // path = '/cards' -> unit = 'card'
      let unit = unslash(menuItem.path).slice(0, -1);
      disp(['unit', unit, menuItem.def, args]);
      return vuClinicTabs;
    },
    render(vnode) { return vuPage(vnode); }
  },
});
