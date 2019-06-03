// src/apps/view/vuApp.js

import { vuMain } from './vuMain.js';

export const vuTheader = {
  view (vnode) {
    return m(".pure-g",
      m(".pure-u-1-1.box-1",
        m('span.dheader', vnode.attrs.header )
      )
    );
  }
}

export const vuApp = {
  view: function(vnode) {
    return m('div', {
        style: "margin: 0 auto; padding-top: 5em; width: 50%;"
      },
      m('h1.blue', {style: "font-size: 3em;"}, vnode.attrs.text)
    );
  }
}

export const vuView = function(appMenu, view) {
  return m(vuMain, appMenu, view);
}
export const vuLoading = {
  view() { 
    return m(".loading-icon", 
      m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
      m('span.sr-only', 'Loading...')
    );
  }
}
