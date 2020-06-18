
// src/sprav/router/roRouter.js

import { vuPage, tomatch, torender } from '../spravApi';
//import { vuSheet } from '../view/vuSheet';

export const roRouter = view => route => ({
  [route.path.split(':')[0]]: {
    render() { return torender(route) }
  },
  [route.path]: {
    onmatch: tomatch(route, view),
    render(vnode) { return vuPage(vnode); }
  },
});
