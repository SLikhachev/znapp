


// NOT USED REPLACED BY roClinic 

import { disp } from '../../apps/appApi';
import { vuPage } from '../../apps/appRouter';
//import { cards } from '../defines/defCards';
import { vuClinicList } from '../view/vuClinicList';
import { vuClinicTabs } from '../view/vuClinicTabs';


export const roCards = unit => ({
  [unit.path]: {
    onmatch() {
      disp(['suite', unit.def, unit.router]);
      return vuClinicList;
    },
    render(vnode) { return vuPage(vnode); },
  },

  [`${unit.path}${unit.item}`]: {
    onmatch(args) {
      //const { card } = args;
      disp(['unit', unit.router, unit.def, args]);
      return vuClinicTabs;
    },
    render(vnode) { return vuPage(vnode); }
  },
});
