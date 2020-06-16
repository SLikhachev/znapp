
// src/sprav/router/roProf.js

import { disp, tomatch, torender } from '../spravApi';
import { pmus } from '../defines/defPmus';
import { vuSprav } from '../view/vuSprav';
import { vuSheet } from '../view/vuSheet';
import { vuPmu } from '../view/vuPmuItem';

export const roPmus = {
  [pmus.path.split(':')[0]]: {
    render() { return torender(pmus) }
  },

  [pmus.path]: {
    onmatch: tomatch(pmus, vuSheet),
    render(vnode) { return vuSprav(vnode); }
  },

  [pmus.path.split(':')[0] + 'pmus/:id']: {
    onmatch(args) {
      const { id } = args;
      disp(['pmu', pmus.def, 'pmus', id]);
      return vuPmu;
    },
    render(vnode) { return vuSprav(vnode); }
  },

  [pmus.path.split(':')[0] + 'pmu_grup/:id']: {
    onmatch(args) {
      const { id } = args;
      disp(['pmu', pmus.def, 'pmu_grup', id]);
      return vuPmu;
    },
    render(vnode) { return vuSprav(vnode); }
  },

}
