
// src/clinic/view/vuTabs.js
import { vuDialog } from '../../apps/view/vuDialog.js';
import { states } from '../../apps/appApi.js';


export const toFocus = function (vnode) {
  vnode.dom.focus();
};

export const setPale = function (e) {
  e.target.setAttribute('style', 'opacity: 0.5');
}

export const delPale = function (e) {
  e.target.setAttribute('style', 'opacity: 1.0');
}

export const tabsView = () => {

  let tabs = [], tabs_cont = [], def, itdef, thisTabs = [];

  const hideTabs = idx => {
    for (let id = idx; id < tabs.length; id++) {
      tabs[id].classList.remove('active');
      tabs_cont[id].classList.remove('show');
      tabs_cont[id].classList.add('hide');
    }
  };

  const changeTab = event => {
    let idx = parseInt(event.target.getAttribute('idx'));
    if (tabs_cont[idx].classList.contains('hide')) {
      hideTabs(0);
      tabs[idx].classList.add('active');
      tabs_cont[idx].classList.remove('hide');
      tabs_cont[idx].classList.add('show');
    }

  };
  return {
    oncreate() {
      tabs = document.getElementsByClassName('tab');
      tabs_cont = document.getElementsByClassName('tab-content');
      tabs[0].classList.add('active');
      tabs_cont[0].classList.add('show');
      hideTabs(1); // other hide
    },

    view(vnode) {
      def = states().suite[states().unit];
      itdef = def.item;
      ({ thisTabs } = vnode.attrs);

      return [m('div#tabs', [
        thisTabs.map((tab, idx) => m('.tab',
          { idx, onclick: changeTab }, tab.name)),
        thisTabs.map(tab => m('.tab-content',
          tab.content()))
      ]),
      m(vuDialog, { itdef, word: states().word },
        m('dl', [m('dt', "Ошибки обработки"),
        states().errorsList.map(err => m('dd.red',
          { style: "font-size: 1.2em; font-weight: 600" },
          err))
        ])
      )];
    }
  };
};

// oncreate FORM callback used for move from tag to tag with enter key
// based on tabindex value of tag 
export const nextTagFocus = vnode => Array.from(
  vnode.dom.querySelectorAll("input,select,button")).
  forEach(tag => tag.addEventListener("keypress", e => {
    if (e.which === 13 || e.keyCode === 13) { // enter key
      e.preventDefault();
      let tabindex = parseInt(e.target.getAttribute('tabindex'));
      if (isNaN(tabindex)) return;
      let nextTag = vnode.dom.querySelectorAll(`[tabindex="${++tabindex}"]`);
      nextTag = nextTag.length === 0 ?
        vnode.dom.querySelectorAll('[tabindex="1"]') :
        nextTag;
      nextTag[0].focus();
    }
  })
  );

