// src/sprav/view/vuDataSheet.js

import { moModel } from '../../apps/model/moModel.js';
import { vuDialog } from '../../apps/view/vuDialog.js';
import { vuTheader, vuFind, vuForm } from './vuSprav.js';

// clojure
const vuDataSheet = function (vnode) {
  
  var modelObject = vnode.attrs.model, // model Object
    headerString = vnode.attrs.header, // String: page header 
    nameString = vnode.attrs.name, // String: models item name 
    findInt = vnode.attrs.find, // Int: how many cols include in find function
    structObject = vnode.attrs.struct; // the struct Object
    
  return {
    
  oninit () {
    moModel.getList( vnode.attrs.model );
    moModel.getData( vnode.attrs.model );
  },
  /*
  oncreate() {
  },
  
  onupdate() {
  },
  */
  listMap (s) {
    //let id = s.code + ' ' + s.spec;
    let first = true;
    return m('tr', [
      Object.keys(structObject).map( (column) => {
        let td = first ? m('td.choice.blue', {
          data:  s.id,
          onclick: modelObject.editable ? m.withAttr( "data", vuForm.dput) : ''
        }, s[column]) : m('td', s[column]);
        first = false;
        return td;
      }),
      modelObject.editable ? 
      m('td', m('i.fa.fa-minus-circle.choice.red', {
        data: s.id,
        onclick: m.withAttr( "data", vuForm.ddel)
      }) ) : ''
    ]);
  },

  view () {
    
    //return m(tableView, {model: this.model , header: this.header }, [
    return modelObject.error ? [ m(".error", modelObject.error) ] :
      modelObject.list ? [
        m(vuTheader, { header: headerString} ),
        m(vuFind, {cols: findInt} ),
        
        m('table.pure-table.pure-table-bordered[id=find_table]', [
          m('thead', [
            m('tr', [
              Object.keys(structObject).map( (column) => {
                let field = structObject[column];
                return field.length > 1 ? m('th.sortable',
                  { data: column, onclick: m.withAttr('data', modelObject.sort) },
                  [field[0], m('i.fa.fa-sort.pl10')]
                  ) : m('th', field[0]);
              }),
              modelObject.editable ? m('th', "Удалить") : ''
            ])
          ]),
          m('tbody', [modelObject.list.map( this.listMap )] )
        ]),
        modelObject.editable ? this.itemForm ? 
        m(vuDialog,
          { header: headerString,
            word: vuForm.word
          }, m(vuForm, { model: modelObject, name: nameString },
              m(this.itemForm, { item: vuForm.item, data: modelObject.data, method: vuForm.method } )
             )
        ) : m('h2', 'Не определена форма редактирования объекта') : ''
        
      ] : m(".loading-icon", [
            m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
            m('span.sr-only', 'Loading...')
          ]); 
  }
  }; //return this object
}

export { vuDataSheet };