// src/clinic/view/vuDul.js

import { vuDataSheet } from './vuDataSheet';

//POJO
const itemForm = {
    
  view(vnode) {
    let item = vnode.attrs.item,
    ro = vnode.attrs.method === 'DELETE' ? true : false;
    return m('fieldset', [      
      m('input[type=hidden][name=id]', {value: item ? item.id : '' } ),
      m('.pure-control-group', [
        m('label[for=code]', 'Код документа'),
        m('input.fcode[id=code][type=text][name=code]', {
          value: item ? item.code : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ]),
      m('.pure-control-group', [
        m('label[for=dname]', 'Наименование'),
        m('textarea[id=dname][name=name][cols=40]',
          {readonly: ro},
          item ? item.name : '')
      ]),
      m('.pure-control-group', [
        m('label[for=serial]', 'Шаблон серии'),
        m('input.fname[id=serial][type=text][name=serial_tpl]', {
          value: item ? item.serial_tpl : '',
          readonly: ro,
        }),
      ]),
      m('.pure-control-group', [
        m('label[for=number]', 'Шаблон номера'),
        m('input.fname[id=number][type=text][name=number_tpl]', {
          value: item ? item.number_tpl : '',
          readonly: ro
        }),
      ]),
    ]);
  },
}
// clojure
const vuDul = function (vnode) {
  let view = vuDataSheet(vnode);
  view.itemForm = itemForm;
  return view;
}

export { vuDul };