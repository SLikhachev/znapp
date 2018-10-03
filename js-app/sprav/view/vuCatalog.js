// src/sprav/view/vuCatalog.js

import { moModel } from '../../apps/model/moModel.js';
import { vuDialog } from '../../apps/view/vuDialog.js';
import { vuTheader, vuFind, vuForm } from './vuSprav.js';

const itemForm = {

  view(vnode) {
    let item = vnode.attrs.item,
    ro = vnode.attrs.method === 'DELETE' ? true : false;
    
    return m('fieldset', [
      m('.pure-control-group', [
        m('label[for=code]', 'Код'),
        m('input.fcode[id=code][type=text][name=id]', {
          value: item ? item.id : '',
          readonly: item ? true : false,
          'data-validation': 'number',
          'data-validation-error-msg': 'целое число'
        } ),
        item ? m('span.pure-form-message-inline', 'Поле не редактируется.') : ''
      ]),
      m('.pure-control-group', [
        m('label[for=desc]', this.name),
        m('textarea[id=desc][name=name][cols=40]',
          {readonly: ro},
          item ? item.name : '')
      ])
    ]);
  },
  
}

// clojure
const vuCatalog = function(vnode) {
  
  var model = vnode.attrs.model,
  header = vnode.attrs.header,
  name = vnode.attrs.name;
  
  return {
  
  oninit () {
   moModel.getList( model );
   //console.log(name);
  },

  oncreate() {
    //m.redraw();
  },
  
  onupdate() {
    //m.redraw();
    //this.model = vnode.attrs.model;
    //moModel.getList( vnode.attrs.model );
    //this.header = vnode.attrs.header;
    //this.name = vnode.attrs.name;         
  },
  
  listMap (s) {
    return m('tr', [
      m('td.choice.blue', {
          data: s.id,
          onclick: model.editable ? m.withAttr( "data", vuForm.dput) : ''
        }, s.id),
      m('td', s.name),
      model.editable ? 
      m('td', 
        m('i.fa.fa-minus-circle.choice.red', {
          data: s.id,
          onclick: m.withAttr( "data", vuForm.ddel)
        })
      ) : ''
    ]);
  },

  view () {
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        m(vuTheader, { header: header} ),
        m(vuFind, { cols: 2, addButton: model.editable} ),
        m('table.pure-table.pure-table-bordered[id="find_table"]', [
          m('thead', [
            m('tr', [
              m('th.choice', {data: "id", onclick: m.withAttr( "data", model.sort) },
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
              m(itemForm, { item: vuForm.item, method: vuForm.method  } )
            )
          ) : []
      ] : m(".loading-icon", [
          m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
          m('span.sr-only', 'Loading...')
      ]);
  }
  
  }
}
// 
export { vuCatalog };