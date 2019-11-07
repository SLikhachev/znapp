// src/report/view/vuDataSheet.js

import { vuLoading, vuTheader } from '../../apps/view/vuApp.js';
import { _schema } from '../../apps/model/moModel.js';
import { moModel } from '../model/moModel.js';


export const vuDataSheet = function (vnode) {
  
  //getList (schema, model, params=null, method='GET') {
  let { model, struct, header, params } = vnode.attrs;
  
  moModel.getList( _schema('pg_rest'), model, params);
  
  return {

  listMap (s) {
    //let id = s.code + ' ' + s.spec;
    let first = true;
    return m('tr', [
      Object.keys(struct).map( (column) => {
        let field = struct[column],
        value = field[1] ? field[1]( s[column] ) : s[column]; // 2nd el is function if any
        let td = first ? m('td.blue', {
        }, value) : m('td', value);
        first = false;
        return td;
      })
    ]);
  },

  view () {
    
    //return m(tableView, {model: this.model , header: this.header }, [
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        m(vuTheader, { header: header} ),
        this.form ? m(this.form, {model:  model}) : '',
        m('table.pure-table.pure-table-bordered[id=find_table]', [
          m('thead', [
            m('tr', [
              Object.keys(struct).map( (column) => {
                let field = struct[column];
                return field[2] ? m('th.sortable', // 3rd el sortable bool
                  { data: column, onclick: e => model.sort },
                  [field[0], m('i.fa.fa-sort.pl10')]
                  ) : m('th', field[0]);
              }),
            ])
          ]),
          m('tbody', [model.list.map( this.listMap )] )
        ]),
      ] : m(vuLoading);
  }
  }; //return this object
}
