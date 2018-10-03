// src/clinic/view/vuMoLocal.js

import { vuDataSheet } from './vuDataSheet';

//POJO
const itemForm = {
    
  view(vnode) {
    let item = vnode.attrs.item,
    ro = vnode.attrs.method === 'DELETE' ? true : false;
    return m('fieldset', [      
      m('input[type=hidden][name=id]', {value: item ? item.id : '' } ),
      m('.pure-control-group', [
        m('label[for=code]', 'Код MO'),
        m('input.lcode[id=code][type=text][name=code]', {
          value: item ? item.code : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ]),
      m('.pure-control-group', [
        m('label[for=scode]', 'Код MO для ТФОМС'),
        m('input.fcode[id=scode][type=text][name=scode]', {
          value: item ? item.scode : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ]),
      m('.pure-control-group', [
        m('label[for=sname]', 'Наименование кратко'),
        m('textarea[id=sname][name=sname][cols=40]',
          {readonly: ro},
          item ? item.sname : '')
      ]),
      m('.pure-control-group', [
        m('label[for=name]', 'Наименование полное'),
        m('textarea[id=name][name=name][cols=40]',
          {readonly: ro},
          item ? item.name : '')
      ]),
    ]);
  },
}
// clojure
const vuMoLocal = function (vnode) {
  let view = vuDataSheet(vnode);
  view.itemForm = itemForm;
  return view;
}

export { vuMoLocal };