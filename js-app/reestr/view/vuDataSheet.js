// src/report/view/vuDataSheet.js

import { vuTheader } from '../../apps/view/vuApp.js';
import { moModel } from '../model/moModel.js';

// clojure
const vuDataSheet = function (vnode) {
  
  var modelObject = vnode.attrs.model, // model Object
    structObject = vnode.attrs.struct, // the struct Object
    headerString = vnode.attrs.header;
  
  return {
    
  oninit () {
    moModel.getList( vnode.attrs.model );
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
        let field = structObject[column],
        value = field[1] ? field[1]( s[column] ) : s[column]; // 2nd el is function if any
        let td = first ? m('td.blue', {
        }, value) : m('td', value);
        first = false;
        return td;
      })
    ]);
  },

  view (vnode) {
    
    //return m(tableView, {model: this.model , header: this.header }, [
    return modelObject.error ? [ m(".error", modelObject.error) ] :
      modelObject.list ? [
        m(vuTheader, { header: headerString} ),
        this.form ? m(this.form, {model:  vnode.attrs.model}) : '',
        
        
        m('table.pure-table.pure-table-bordered[id=find_table]', [
          m('thead', [
            m('tr', [
              Object.keys(structObject).map( (column) => {
                let field = structObject[column];
                return field[2] ? m('th.sortable', // 3rd el sortable bool
                  { data: column, onclick: m.withAttr('data', modelObject.sort) },
                  [field[0], m('i.fa.fa-sort.pl10')]
                  ) : m('th', field[0]);
              }),
            ])
          ]),
          m('tbody', [modelObject.list.map( this.listMap )] )
        ]),
      ] : m(".loading-icon", [
            m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
            m('span.sr-only', 'Loading...')
          ]); 
  }
  }; //return this object
}

export { vuDataSheet };