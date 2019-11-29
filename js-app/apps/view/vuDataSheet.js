// src/apps/view/vuDataSheet.js

import { clinicApi } from '../../clinic/clinicApi.js';
import { _schema } from '../model/moModel.js';
import { moModel } from '../model/moFormModel.js';
import { vuLoading, vuTheader } from './vuApp.js';


export const doTask= async function ( event, promise ) {
  event.preventDefault();
  let resp= document.getElementById('resp'); // taskResp - view with #resp dom
  //resp.classList.add('disable');
  resp.open= false;
  let res= await promise;
  //task.classList.remove('disable');
  resp.open= true;
  return res;
};

export const get_fref= ()=> {
    //card_id: "/cards/:crd",
    const card_id = clinicApi.card_id.split(':')[0];
    //talon_id: "/talons/:tal/:crd",
    const talon_id = clinicApi.talon_id.split(':')[0];
    let clinic = location.href.split('/').slice(0, 3);
    clinic[1] = '/';
    clinic.push('clinic/#!');
    let root = clinic.join('/');
    const link = (val, ref) => m('a', {href: `${root}${ref}`, target: '_blank'}, val);

    return (obj, fild) => {
        if (fild == 'crd_num')
            return link(obj.crd_num, `${card_id}${obj.crd_num}`);
        if (fild == 'tal_num')
            return link(obj.tal_num, `${talon_id}${obj.tal_num}/${obj.crd_num}`);
        return obj[fild];
    };
};


export const vuDataSheet = function (vnode) {
  
  //getList (schema, model, params=null, method='GET') {
  let { model, struct, header, params } = vnode.attrs;
  if ( !model.quiet )
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
      ] : model.quiet ? '': m(vuLoading);
  }
  }; //return this object
}
