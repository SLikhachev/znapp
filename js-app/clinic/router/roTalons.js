

// NOT USED REPLACED BY roClinic 

import { disp } from '../../apps/appApi';
import { vuPage } from '../../apps/appRouter';
import { talons } from '../defines/defTalons';
import { vuClinicList } from '../view/vuClinicList';
import { vuClinicTabs } from '../view/vuClinicTabs';

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
      console.log('talon router', args);
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
