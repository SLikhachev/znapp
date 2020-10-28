


import { disp } from '../../apps/appApi';
import { vuPage } from '../../apps/appRouter';
import { vuClinicList } from '../view/vuClinicList';
import { vuClinicTabs } from '../view/vuClinicTabs';

const unslash = string => string.toString().split('/')[1];

export const clinicRouter = menuItem => ({
  [menuItem.path]: {
    onmatch() {
      // path = '/cards' -> unit = 'cards' ;
      let unit = unslash(menuItem.path);
      disp(['suite', menuItem.def, unit]);
      return vuClinicList;
    },
    render(vnode) { return vuPage(vnode); },
  },

  [`${menuItem.path}${menuItem.item}`]: {
    onmatch(args) {
      //const { card } = args;
      // path = '/cards/add' -> unit = 'card'
      let unit = unslash(menuItem.path).slice(0, -1);
      disp(['unit', menuItem.def, unit, args]);
      return vuClinicTabs;
    },
    render(vnode) { return vuPage(vnode); }
  },
});
