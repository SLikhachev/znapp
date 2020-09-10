

// src/sparv/spravApi.js
/**
  */

import { app, states, disp } from './appApi';
import { vuView, vuPageTitle } from './view/vuMain';


export const vuPage = view => vuView({ spaMenu: app.menu }, view)
// 
export const rootRouter = {
  [app.menu.root]: {
    render() {
      return vuPage(m(vuPageTitle, { text: app.initial.suite.page }));
    }
  }
};

export const pageView = state => vuPage(m(vuPageTitle, { text: state().suite.page }));

export const torender = path => {
  disp(['suite', path.def]);
  //return vuPage(m(vuPageTitle, { text: states().suite.page }));
  return pageView(states);
}

// route on match helper
export const tomatch = (path, view) => args => {
  //console.count('on match')
  const { item } = args;
  const idx = path.items.indexOf(item);
  if (idx < 0) return m.route.SKIP;
  disp(['unit', path.def, item]);
  return view;
};

export const pathRouter = view => route => ({
  [route.path.split(':')[0]]: {
    render() { return torender(route) }
  },
  [route.path]: {
    onmatch: tomatch(route, view),
    render(vnode) { return vuPage(vnode); }
  },
});

export const routerFun = (menu, addroute, router) => {
  // menu:: Object,
  // addroute:: Object { path: routerFunction -> routerObject }
  // router:: menuItem -> routerObject
  let root = rootRouter, next;
  Object.keys(menu).forEach(m => {
    if (m === 'root') return;
    if (!!menu[m].router)
      next = addroute[m]();
    else
      next = router(menu[m]);
    Object.assign(root, next);
  });
  return root;
};
