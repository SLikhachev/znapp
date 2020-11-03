// src/apps/view/vuDialog.js

// https://github.com/GoogleChrome/dialog-polyfill
// https://html5test.com/
// Fifix since 53 about:config
// dom.dialog_element.enabled

'use strict';

export const vuDialog = {

  dialog: null,
  //dialog: document.getElementById('dialog'),
  error: '',

  derror() {
    return vuDialog.error ?
      { display: 'display: block', msg: vuDialog.error } :
      { display: 'display: none', msg: '' };
  },

  oncreate(vnode) {
    vuDialog.dialog = vnode.dom;
    //console.log(dialogView.dialog);
  },

  view(vnode) {
    let header = vnode.attrs.itdef.header || vnode.attrs.itdef.name || '';
    let word = vnode.attrs.word || '';
    return m('dialog#dialog', m('.dialog-content', [
      m('i.fa fa-times.dclose', { onclick: vuDialog.close }),
      m('span.dheader', `${header} (${word})`),
      vnode.children,
      m('div', { style: vuDialog.derror().display }, [
        m('br'), m('span.red', 'Ошибка базы данных:'),
        m('br'), m('span.red', vuDialog.derror().msg)
      ])
    ])
    );
  },

  open() {
    vuDialog.dialog.showModal();
    return false;
  },

  close(reload = false) {
    const f = vuDialog.dialog.querySelector('form');
    if (Boolean(f)) f.reset();
    vuDialog.error = '';
    vuDialog.dialog.close();
    if (reload) m.redraw();
    return false;
  },
};
