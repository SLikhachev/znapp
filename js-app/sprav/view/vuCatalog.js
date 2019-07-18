// src/sprav/view/vuCatalog.js

//import { vuLoading } from '../../apps/view/vuApp.js';
//import { moModel } from '../../apps/model/moModel.js';
//import { vuDialog } from '../../apps/view/vuDialog.js';
//import { change, vuTheader, vuFind, vuForm } from './vuSprav.js';
import { vuSheet } from './vuSheet';

const itemForm = function(vnode) {
  let item; // = vnode.attrs.item;
  
  return {
    view(vnode) {
      item = vnode.attrs.item;
      //ro = vnode.attrs.method === 'DELETE' ? true : false;
    
      return m('fieldset', [
        m('.pure-control-group', [
          m('label[for=code]', 'Код'),
          m('input.fcode[id=code][type=number][name=id]', {
            value: item.id ? item.id : '',
            readonly: item.id ? true : false, //id is auto
          }),
          item.id ? m('span.pure-form-message-inline', 'Поле не редактируется.') : ''
        ]),
        m('.pure-control-group', [
          m('label[for=desc]', this.name),
          m('textarea[id=desc][name=name][cols=40]',
            item.name ? item.name : '')
        ])
      ]);
    },
  };
}

// clojure
export const vuCatalog = function(vnode) {
  let view = vuSheet(vnode);
  view.itemForm = itemForm;
  return view;
}

const vuCat = function(vnode) {  
  
  let model = vnode.attrs.model,
  header = vnode.attrs.header,
  name = vnode.attrs.name;
  
  const edit= function(e) {
    return change(e, model, 'PATCH', 'Изменить');
  };
  const ddel= function(e) {
    return change(e, model, 'DELETE', 'Удалить');
  };
  const sort=  e=> {
    e.preventDefault();
    return model.sort(e.target.getAttribute('data'));
  };
  
  return {
  
    oninit () {
     moModel.getList( model );
   //console.log(name);
    },
  
    listMap (s) {
      return m('tr', [
        m('td.choice.blue', {
            data: s.id,
            onclick: model.editable ? edit : ''
        }, s.id),
      m('td', s.name),
      model.editable ? 
      m('td', 
        m('i.fa.fa-minus-circle.choice.red', {
          data: s.id,
          onclick: ddel
        })
      ) : ''
    ]);
  },

  view () {
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        m(vuTheader, { header: header} ),
        m(vuFind, {cols: 2, model: modelObject} ),
        //
        m('table.pure-table.pure-table-bordered[id="find_table"]', [
          m('thead', [
            m('tr', [
              m('th.choice', {data: "id", onclick: sort },
                ["Код", m('i.fa.fa-sort.pl10')] ),
              m('th', name),
              model.editable ? m('th', "Удалить") : '',
            ])
          ]),
          m('tbody', [model.list.map( this.listMap ) ] )
        ]),
        model.editable ? 
          m(vuDialog, { header: header, word: vuForm.word },
            m(vuForm, { model: model, name: name },
              m(itemForm, { model: model, method: vuForm.method  } )
            ) 
          ) : ''
      ] : m(vuLoading);
    },
  };
}
// 
