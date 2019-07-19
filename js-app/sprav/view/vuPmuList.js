// src/sprav/view/vuComboSheet.js

import { vuLoading } from '../../apps/view/vuApp.js';
import { spravApi } from '../spravApi';
//import { moModel } from '../../apps/model/moModel.js';
//import { vuDialog } from '../../apps/view/vuDialog.js';
import { change, vuTheader, vuForm } from './vuSprav.js';

// this for pmu yet



export const vuTableRow= function(vnode) {
  let data= vnode.attrs.data;
  let row= vnode.attrs.row;
  //console.log(data);
  
  let first_cell= id => {
    return m('td.choice.blue', id);
  };
  
  let dialog_attr = id => {
    return m('td.choice.blue', {
      data: id, // every item must have id attr
      onclick: data.edit ? data.edit : ''
    }, id);
  };
  let anchor_tag= id => {
    return m('td.choice.blue', m('a', {
      href: `${data.href}/${id}`,
      oncreate: m.route.link
    }, id));
  };
  
  return {
    
    view() {
      let first = true;
      return m('tr', [
        Object.keys(data.struct).map( column => {
          let td = first ? // first will be anchor code 
            data.dialog ? dialog_attr(row.id):
            data.href ? anchor_tag(row[column]): m('td.choice.blue', row[column])
          : m('td', row[column]);
          first = false;
          return td;
        })
      ]);
    },
  };
}


// clojure
export const vuPmuList = function (vnode) {
  
  let model= vnode.attrs.model, 
    header= vnode.attrs.header, // String: page header 
    //findString= vnode.attrs.findstr, // find help string
    //findForm = vnode.attrs.findForm, // form to find
    nameString = vnode.attrs.name, // String: models item name
    filterForm = vnode.attrs.filter, //
    struct= vnode.attrs.struct; // the struct Object
  // init - show only find form initially
  let load = false;
  
  let listMap= el => m(vuTableRow, { row: el, data: { struct: struct, href: spravApi.prof_pmus  } } );
  
  return {
    
    oninit () {
    },
    onupdate() {
      load = true;
    },

    view() {
     
      return [
        header ? m(vuTheader, {header: header}): '',
        this.findForm ? m(this.findForm, {model: model}): '',
          model.error ? [m(".error", model.error)] :
            model.list ? [
              filterForm ? m(filterForm): '' ,
              m('table.pure-table.pure-table-bordered[id=find_table]', [
                m('thead', m('tr',
                  Object.keys(struct).map( (column) => {
                    return m('th', struct[column][0]);
                  })  // not sorted
                )),
                m('tbody', [model.list.map(listMap)])
              ]),
            ] : load ? m(vuLoading): ''
        ];
    }
  }; //return this object
}

