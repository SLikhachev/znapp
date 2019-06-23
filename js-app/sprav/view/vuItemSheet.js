// src/sprav/view/vuComboSheet.js

import { vuLoading } from '../../apps/view/vuApp.js';
//import { moModel } from '../../apps/model/moModel.js';
//import { vuDialog } from '../../apps/view/vuDialog.js';
import { change, vuTheader } from './vuSprav.js';

// this for pmu yet

// clojure
export const vuItemSheet = function (vnode) {
  
  let modelObject = vnode.attrs.model, // model Object
    headerString = vnode.attrs.header, // String: page header 
    //findString= vnode.attrs.findstr, // find help string
    //listMap = vnode.attrs.listMap, // list mapping function
    findForm = vnode.attrs.findForm, // form to find
    //nameString = vnode.attrs.name, // String: models item name
    filterForm = vnode.attrs.filter, //
    structObject = vnode.attrs.struct; // the struct Object
  // init - show only find form initially
  let load = false;
  
  const edit= function(e) {
    return change(e, modelObject, 'PATCH', 'Изменить');
  };
  
  let listMap= function(s) {
    let first = true;
    return m('tr', [
      Object.keys(structObject).map( (column) => {
        let td = first ? m('td.choice.blue', {
          data:  s.id, // every item must have id attr
          onclick: modelObject.edit ? edit : ''
        }, s[column]) : m('td', s[column]);
        first = false;
        return td;
      })
    ]);
  };
  
  return {
    
    oninit () {
      //moModel.getList( vnode.attrs.model );
      //moModel.getData( vnode.attrs.model );
    },
    onupdate() {
      load = true; 
    },

    view: function () {
     
      return [
        m(vuTheader, {header: headerString}),
        m(findForm, {model: modelObject}),
//        init ? m('h1.blue', {style: "font-size: 1.2em;"}, `${findString}`) :
          modelObject.error ? [m(".error", modelObject.error)] :
            modelObject.list ? [
              filterForm ? m(filterForm): '' ,
              m('table.pure-table.pure-table-bordered[id=find_table]', [
                m('thead', m('tr',
                  Object.keys(structObject).map( (column) => {
                    return m('th', structObject[column][0]);
                  })  // not sorted
                )),
                m('tbody', [modelObject.list.map(listMap)])
              ])
            ] : load ? m(vuLoading): ''
        ];
    }
  }; //return this object
}
