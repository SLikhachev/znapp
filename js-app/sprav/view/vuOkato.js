// src/clinic/view/vuOkato.js

import { vuDataSheet } from './vuDataSheet';

//POJO
const itemForm = {
    
  view(vnode) {
    let item = vnode.attrs.item,
    ro = vnode.attrs.method === 'DELETE' ? true : false;
    return m('fieldset', [      
      m('input[type=hidden][name=id]', {value: item ? item.id : '' } ),
      m('.pure-control-group', [
        m('label[for=okato]', 'Код OКАТО'),
        m('input.lcode[id=okato][type=text][name=okato]', {
          value: item ? item.okato : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ]),
      m('.pure-control-group', [
        m('label[for=region]', 'Код региона'),
        m('input.fcode[id=region][type=text][name=region]', {
          value: item ? item.region : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ]),
      m('.pure-control-group', [
        m('label[for=name]', 'Наименование региона'),
        m('textarea[id=name][name=name][cols=40]',
          {readonly: ro},
          item ? item.name : '')
      ]),
    ]);
  },
}
// clojure
const vuOkato = function (vnode) {
  let view = vuDataSheet(vnode);
  view.itemForm = itemForm;
  return view;
}

export { vuOkato };