
// src/sparv/spravApi.js
/**
  */

import { vuView, vuPageTitle } from './view/vuMain';
import { up } from './utils';


const [stream, scan] = [m.stream, m.stream.scan];


export const app = {
  initial: {
    suite: { page: "Медстатстика" },
    //unit: null,
    //pk: null,
    //list: null,
    //error: null,
    //method,
    //word,
    //id,

  },

  Actions: (state, update) => {
    // stream of states
    const stup = up(update);
    return {};
  },

  menu: {
    root: '/'
  }
}


export const update = stream(); // update states stream
const acc = (state, patch) => patch(state);
export const states = scan(acc, app.initial, update);

export const disp = stream(); // event dispatcher stream 
//const actions = app.Actions(states, update); //=> obj of func ref

//[actionName, args] 
/**
disp.map(av => {
  let [event, ...args] = av;
  return actions[event] ? actions[event](args) : stream.SKIP
})
*/
//export const setInitial = initial => Object.assign(app, { initial });
//export const setActions = Actions => Object.assign(app, { Actions });
//export const setMenu = menu => Object.assign(app, { menu });

export const vuPage = view => vuView({ spaMenu: app.menu }, view)
// 
export const rootRouter = {
  [app.menu.root]: {
    render() {
      return vuPage(m(vuPageTitle, { text: states().suite.page }));
    }
  }
};


export const torender = path => {
  disp(['suite', path.def]);
  return vuPage(m(vuPageTitle, { text: states().suite.page }));
}

// route on match helper
export const tomatch = (path, view) => args => {
  //console.count('on match')
  const { item } = args;
  const idx = path.items.indexOf(item);
  if (idx < 0) return m.route.SKIP;
  disp(['unit', path.def, item]);
  return view;
}

export const pathRouter = view => route => ({
  [route.path.split(':')[0]]: {
    render() { return torender(route) }
  },
  [route.path]: {
    onmatch: tomatch(route, view),
    render(vnode) { return vuPage(vnode); }
  },
});
