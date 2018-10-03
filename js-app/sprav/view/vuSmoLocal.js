// src/clinic/view/vuSmoLocal.js

import { vuDataSheet } from './vuDataSheet';

//POJO
const itemForm = {
    
  view(vnode) {
    let item = vnode.attrs.item,
    ro = vnode.attrs.method === 'DELETE' ? true : false;
    return m('fieldset', [      
      m('input[type=hidden][name=id]', {value: item ? item.id : '' } ),
      m('.pure-control-group', [
        m('label[for=code]', 'Код СMO'),
        m('input.lcode[id=code][type=text][name=code]', {
          value: item ? item.code : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ]),
      m('.pure-control-group', [
        m('label[for=okato]', 'СМО ОКАТО'),
        m('input.fcode[id=okato][type=text][name=okato]', {
          value: item ? item.okato : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ]),
      m('.pure-control-group', [
        m('label[for=sname]', 'Наименование'),
        m('textarea[id=name][name=name][cols=40]',
          {readonly: ro},
          item ? item.name : '')
      ]),
    ]);
  },
}
// clojure
const vuSmoLocal = function (vnode) {
  let view = vuDataSheet(vnode);
  view.itemForm = itemForm;
  return view;
}

export { vuSmoLocal };