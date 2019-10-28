// src/report/view/vuDataSheet.js

import { vuLoading } from '../../apps/view/vuApp.js';
import { vuTheader } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moModel.js';

// clojure
export const vuReportSheet = function (vnode) {
  
  var { model, struct, header } = vnode.attrs;
  // model Object
  // struct Object
  // header String;
  moModel.getList( model );
  
  const listMap = s=> {
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
  };
  
  const hdr= c=> {
    let field = struct[c];
    return field[2] ? m('th.sortable', // 3rd el sortable bool
      { onclick: ()=> model.sort (c) },
      [field[0], m('i.fa.fa-sort.pl10')]
    ) : m('th', field[0]);
  };
  
  return {
    view () {
    
    //return m(tableView, {model: this.model , header: this.header }, [
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        m(vuTheader, { header: header} ),
        this.form ? m(this.form, {model:  model}) : '',
        
        m('table.pure-table.pure-table-bordered[id=find_table]', [
          m('thead', m('tr', [ Object.keys(struct).map( hdr ) ]) ),
          m('tbody', [modelObject.list.map( listMap )] )
        ])
      ] : m(vuLoading);
    }
  };
}
