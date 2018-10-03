// src/clinic/view/vuCardsList.js

import { restApi } from '../clinicApi.js';
import { moModel } from '../../apps/model/moModel.js';
import { moCardsList } from '../model/moCards.js';
import { vuCard } from './vuCard.js';

const cardFind = {
  
  //table: null,
  
  /*
  oninit(vnode) {
  },
  */
  
  onupdate(vnode) {
    //let table = document.getElementById(vnode.attrs.table_id);
    //console.log(table);
    /*
    let toXls = document.getElementById("to_xls");
    if (table)
      $(toXls).attr( { href: tableToXls(table), download: vnode.attrs.table_id + '_file.xls' } );
    */
  },
  
  view (vnode) {
    //console.log(vnode.attrs);
    
    
    return m(".pure-g",
      m(".pure-u-1-1",
        m("form.pure-form[id=card_find]",
          m("fieldset",
            m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[name=q_crd][type='search']",
                  {placeholder: "Номер карты",
                  //onkeyup: m.withAttr("value", vmFind.setFind ),
                  //value: vmFind.toFind
                  }
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_fam][type='search']",
                  {placeholder:"Фамилия"}
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_im][type='search']",
                  {placeholder:"Имя"}
                )
              ),
              m(".pure-u-1-5",
                m('button.pure-button.pure-button-primary[type="button"]', {
                    //value: 0,
                    onclick: moCardsList.cardsFind
                  },
                "Найти"
                )
              ), // to xls
                /*
                m(".pure-u-1-5",
                  m('a.pure-button.pure-button-primary', {
                    id: "to_xls",
                    //onclick: moCardsList.cardsFind
                    },
                    "Excel"
                  )
                ) */
            ])
          )
        )
      )
    );
  }
}

// clojure
const vuCardsList = function (vnode) {
  
  let cardz_hdr = {
      crd_num: ['Карта'],
      fam: ['ФИО'],
      birth_date: ['Дата рождения'],
      polis_num: ['Номер полиса'] 
   };
  
  let model = moCardsList.getModel();
  let table, table_id = 'cards_list';
  
  return {
    
  oninit (vnode) {
    //this.model = moCardsList.getModel();
    //moCardsList.getList(model);
    moModel.getViewRpc(model, {}, restApi.cards_cnt.url, restApi.cards_cnt.method );
  },
  
  oncreate(vnode) {
    //table = document.getElementById(table_id);
    //console.log(table);
  },
  
  onupdate(vnode) {
    table = document.getElementById(table_id);
    //console.log(table);
  },
  
  listMap (s) {
    let fio = `${s['fam']} ${s['im']} ${s['ot']}`;
    let first = true;
    return m('tr', [
      Object.keys(cardz_hdr).map( (column) => {
        let cell = column === 'fam' ? fio : s[column];
        let td = first ? m('td.choice.blue', {
          data:  cell,
          onclick: m.withAttr( "data", vuCard.viewCard)
        }, cell) : m('td', cell);
        first = false;
        return td;
      }),
      
      m('td', m('i.fa.fa-minus-circle.choice.red', {
        data: s['crd_num'],
        //onclick: m.withAttr( "data", vuForm.ddel)
      }) )
    ]);
  },

  view (vnode) {

    //return m(tableView, {model: this.model , header: this.header }, [
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        //m(vuTheader, { header: headerString} ),
        m(cardFind, {table_id: table_id } ),
        model.list[0] ? model.list[0].recount ?
          m('h1.blue', {style: "font-size: 1.5em;"},
            `${model.list[0].recount} записей в таблице`) : 
        m('table.pure-table.pure-table-bordered', {id: table_id} , [
          m('thead', [
            m('tr', [
              Object.keys(cardz_hdr).map( (column) => {
                let field = cardz_hdr[column];
                return field.length > 1 ? m('th.sortable',
                  { data: column, onclick: m.withAttr('data', model.sort) },
                  [field[0], m('i.fa.fa-sort.pl10')]
                  ) : m('th', field[0]);
              }),
              m('th', "Удалить")
            ])
          ]),
          m('tbody', [model.list.map( this.listMap )] )
        ]) : m('h1.blue', {style: "font-size: 1.5em;"}, "Нет таких записей")
            
        /*
        m(vuDialog,
          { header: headerString,
            word: vuForm.word
          }, m(vuForm, { model: modelObject, name: nameString },
              m(this.itemForm, { item: vuForm.item, data: modelObject.data, method: vuForm.method } )
             )
        )
        */
      ] : m(".loading-icon", [
            m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
            m('span.sr-only', 'Loading...')
          ]); 
  }
  }; //return this object
}

export { vuCardsList };