// src/sprav/view/vuDataSheet.js


import { moModel } from '../../apps/model/moModel.js';
import { vuLoading } from '../../apps/view/vuApp.js';
import { vuDialog } from '../../apps/view/vuDialog.js';
import { change, vuTheader, vuFilter, vuForm } from './vuSprav.js';

// DataSheet view: assumes model is not a simple list of records
// { id, name }, but has definitely struct defined in Struct module 
// clojure
export const vuDataSheet = function (vnode) {
  
  let modelObject = vnode.attrs.model, // model Object
    headerString = vnode.attrs.header, // String: page header 
    nameString = vnode.attrs.name, // String: models item name 
    findInt = vnode.attrs.find, // Int: how many cols include in find function
    structObject = vnode.attrs.struct; // the struct Object
  
  //let item, method;
  
  const edit= function(e) {
    return change(e, modelObject, 'PATCH', 'Изменить');
  };
  const ddel= function(e) {
    return change(e, modelObject, 'DELETE', 'Удалить');
  };
  
  const sort=  e=> {
    e.preventDefault();
    return modelObject.sort(e.target.getAttribute('data'));
  };
  
  return {
    
    oninit () {
      moModel.getList( modelObject );
      moModel.getData( modelObject );
    },
    //onbeforeupdate() {
      //moModel.getList( modelObject );
      //moModel.getData( modelObject );
    //},
    listMap (s) {
      //let id = s.code + ' ' + s.spec;
      let first = true;
      return m('tr', [
        Object.keys(structObject).map( (column) => {
          let td = first ? m('td.choice.blue', {
            data:  s.id, // every item must have id attr
            onclick: modelObject.edit ? edit : ''
          }, s[column]) : m('td', s[column]);
          first = false;
          return td;
        }),
        modelObject.del ? 
        m('td', m('i.fa.fa-minus-circle.choice.red', {
          data: s.id,
          onclick: ddel
        }) ) : ''
      ]);
    },

    view () {
      return modelObject.error ? [ m(".error", modelObject.error) ] :
        modelObject.list ? [
          m(vuTheader, { header: headerString} ),
          m(vuFilter, {cols: findInt, model: modelObject, add: false} ),
        
          m('table.pure-table.pure-table-bordered[id=find_table]', [
            m('thead', [
              m('tr', [
                Object.keys(structObject).map( (column) => {
                  let field = structObject[column];
                  return field.length > 1 ? m('th.sortable',
                    { data: column, onclick: sort },
                    [field[0], m('i.fa.fa-sort.pl10')]
                    ) : m('th', field[0]);
                }),
                modelObject.del ? m('th', "Удалить") : ''
              ])
            ]),
            m('tbody', [modelObject.list.map( this.listMap )] )
          ]),
          modelObject.edit ? this.itemForm ? // set in parent view if any
          m(vuDialog,
            { header: headerString,
              word: vuForm.word
            }, m(vuForm, { model: modelObject, name: nameString },
                m(this.itemForm, { model: modelObject, method: vuForm.method } )
             )
          ) : m('h2', 'Не определена форма редактирования объекта') : ''
        
        ] : m(vuLoading);
    }
  }; //return this object
}

