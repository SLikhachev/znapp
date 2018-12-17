// src/clinic/view/vuTalonsList.js

import { restClinic } from '../clinicApi.js';
import { moModel } from '../../apps/model/moModel.js';
import { moTalonsList } from '../model/moTalons.js';
import { vuCard } from './vuCard.js';
import { vuTalon } from './vuTalon.js';

const talonFind = {
  
  /*
  oninit(vnode) {
  },
  */
  view (vnode) {
    return m(".pure-g",
      m(".pure-u-1-1",
        m("form.pure-form[id=talon_find]",
          m("fieldset",
            m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[name=q_tal][type='search']",
                  {placeholder: "Номер талона",
                  //onkeyup: m.withAttr("value", vmFind.setFind ),
                  //value: vmFind.toFind
                  }
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_crd][type='search']",
                  {placeholder:"Номер карты"}
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_date][type='date']",
                  {placeholder:"С даты"}
                )
              ),

              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_dcod][type='search']",
                  {placeholder:"Специалист"}
                )
              ),
              
              /*
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_data_end][type='date']",
                  {placeholder:"По дату"}
                )
              ),
              */
              m(".pure-u-1-5",
                m('button.pure-button.pure-button-primary[type="button"]', {
                    //value: 0,
                    onclick: moTalonsList.talonsFind
                  },
                "Найти"
                )
              )
            ])
          )
        )
      )
    );
  }
}


// clojure
const vuTalonsList = function (vnode) {
  
  var talonz_hdr = {
      crd_num: ['Карта', 'link'],
      fam: ['ФИО'],
      tal_num: ['Талон', 'link'],
      open_date: ['Открыт'],
      close_date: ['Закрыт'],
      purp: ['Цель'],
      spec: ['Спец'],
      code: ['Код'],
      family: ['Врач'],
     
   };
  var model = moTalonsList.getModel();

  return {
    
  oninit () {
    //this.model = moCardsList.getModel();
    //moCardsList.getList(model);
    moModel.getViewRpc(model, {}, restClinic.talons_cnt.url, restClinic.talons_cnt.method );
  },
  /*
  oncreate() {
  },
  
  onupdate() {
  },
  */
  listMap (s) {
    let fio = `${s['fam']} ${s['im']} ${s['ot']}`
    return m('tr', [
      Object.keys(talonz_hdr).map( (column) => {
        //console.log(talonz_hdr[column]);
        let cell = column === 'fam' ? fio : s[column];
        let td = talonz_hdr[column].length == 2 ? m('td.choice.blue', {
          data:  cell,
          onclick: column == "crd_num" ?
            m.withAttr( "data", vuCard.viewCard) :
            m.withAttr( "data", vuTalon.viewTalon)
        }, cell) : m('td', cell);
        return td;
      }),
      
      m('td', m('i.fa.fa-minus-circle.choice.red', {
        data: s.tal_num,
        //onclick: m.withAttr( "data", vuForm.ddel)
      }) )
    ]);
  },

  view (vnode) {

    //return m(tableView, {model: this.model , header: this.header }, [
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        //m(vuTheader, { header: headerString} ),
        m(talonFind),
        model.list[0] ? model.list[0].recount ?
          m('h1.blue', {style: "font-size: 1.5em;"},
            `${model.list[0].recount} записей в таблице`) : 
        m('table.pure-table.pure-table-bordered[id=find_table]', [
          m('thead', [
            m('tr', [
              Object.keys(talonz_hdr).map( (column) => {
                let field = talonz_hdr[column];
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

export { vuTalonsList };