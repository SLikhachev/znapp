// src/sprav/view/vuDoctor.js

import { vuDataSheet } from './vuDataSheet';

//POJO
const itemForm = {
    
  view(vnode) {
    let item = vnode.attrs.item,
    ro = vnode.attrs.method === 'DELETE' ? true : false;
    return m('fieldset', [      
      m('input[type=hidden][name=id]', {value: item ? item.id : '' } ),
      m('.pure-control-group', [
        m('label[for=family]', 'Фамилия'),
        m('input.fname[id=family][type=text][name=family]', {
          value: item ? item.family : '',
          readonly: ro,
          'data-validation': 'required',
          'data-validation-error-msg': 'заполнить'
        } ),
        //item ? m('span.pure-form-message-inline', 'Поле не редактируется.') : ''
      ] ),
      m('.pure-control-group', [
        m('label[for=name]', 'Имя'),
        m('input.fname[id=name][type=text][name=name]', {
          value: item ? item.name : '',
          readonly: ro,
          //'data-validation': 'required',
          //'data-validation-error-msg': 'заполнить'
        } ),
        //item ? m('span.pure-form-message-inline', 'Поле не редактируется.') : ''
      ] ),
      m('.pure-control-group', [
        m('label[for=sname]', 'Отчество'),
        m('input.fname[id=sname][type=text][name=sname]', {
          value: item ? item.sname : '',
          readonly: ro,
          //'data-validation': 'required',
          //'data-validation-error-msg': 'заполнить'
        } ),
        //item ? m('span.pure-form-message-inline', 'Поле не редактируется.') : ''
      ] ),
      m('.pure-control-group', [
        m('label[for=snils]', 'СНИЛС'),
        m('input.fname[id=snils][type=text][name=snils]', {
          value: item ? item.snils : '',
          readonly: ro
        } ),
      ] ),
      m('.pure-control-group', [
        m('label[for=code]', 'Код'),
        m('input.fcode[id=code][type=text][name=code]', {
          value: item ? item.code : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        } ),
      ] ),
      m('.pure-control-group', [
        m('label[for=spec]', 'Специальнсть'),
        m('input.fcode[id=spec][type=text][name=spec]', {
          value: item ? item.spec : '',
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        } ),
      ] ),
      m('.pure-control-group', [
        m('label[for=div]', 'Отделение'),
        vnode.attrs.data.division ? m('select[id=div][name=division]',
          vnode.attrs.data.division.map( d => m('option', {
            value: d.id,
            selected: item && item.division == d.id ? true : false
          }, d.name ) )
        ) : m('input.fcode[id=div][type=text][name=division]', {
          value: item ? item.division : 1,
          readonly: ro,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        }),
      ] ),
      m('.pure-control-group', [
        m('label[for=dist]', 'Участок'),
        vnode.attrs.data.district ? m('select[id=dist][name=district]',
          vnode.attrs.data.district.map( d => m('option', {
            value: d.id,
            selected: item && item.district == d.id ? true : false
          }, d.name ) )
        ) : m('input.fcode[id=dist][type=text][name=district]', {
             value: item ? item.district : 0,
             readonly: ro
        } ),
      ] ),
      m('.pure-control-group', [
          m('label[for=tabid]', 'Таб. номер'),
          m('input.fname[id=tabid][type=text][name=tabid]', {
            value: item ? item.tabid : '',
            readonly: ro
          } ),
      ] ),
    ]);
  },
}
// clojure
export const vuDoctor = function (vnode) {
  let view = vuDataSheet(vnode);
  view.itemForm = itemForm;
  return view;
}
