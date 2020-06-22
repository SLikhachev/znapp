
// src/sprav/router/roProf.js

import { disp } from '../../apps/appApi';
import { pathRouter, vuPage } from '../../apps/appRouter';
import { pmus } from '../defines/defPmus';
import { vuSheet } from '../view/vuSheet';
import { vuPmu } from '../view/vuPmuItem';


export const roPmus = () => {
  const router = pathRouter(vuSheet)(pmus);
  /*
      [pmus.path.split(':')[0]]: {
        render() { return torender(pmus) }
      },
  
      [pmus.path]: {
        onmatch: tomatch(pmus, vuSheet),
        render(vnode) { return vuSprav(vnode); }
      },
    };
  */
  const addroute = {
    [pmus.path.split(':')[0] + 'pmus/:id']: {
      onmatch(args) {
        const { id } = args;
        disp(['pmu', pmus.def, 'pmus', id]);
        return vuPmu;
      },
      render(vnode) { return vuPage(vnode); }
    },

    [pmus.path.split(':')[0] + 'pmu_grup/:id']: {
      onmatch(args) {
        const { id } = args;
        disp(['pmu', pmus.def, 'pmu_grup', id]);
        return vuPmu;
      },
      render(vnode) { return vuPage(vnode); }
    }
  }
  return Object.assign({}, router, addroute);
}
