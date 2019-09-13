// src/clinic/view/vuTalonsList.js

import { vuLoading } from '../../apps/view/vuApp.js';
import { restClinic, clinicApi } from '../clinicApi.js';
import { moModel } from '../../apps/model/moModel.js';
import { moTalonsList } from '../model/moTalons.js';
//import { toCard } from './vuCardsList.js';
//import { vuTalon } from './vuTalon.js';

const talonFind = function(vnode){
  
  let { model } = vnode.attrs;
  
  const findTalons= function(event) {  
    event.preventDefault();
    let data = moModel.getFormData( $('form#talon_find') );
    //console.log ( data );
    //moTalonsList.model.list=[];
    //return false;
    if (data.q_tal === "")
      data.q_tal = 1;
    if ( data.q_crd === "" && (data.q_date !== "" || data.q_dspec !== "" ) )
      data.q_crd = ".*";
    if (data.q_date === "" && data.q_dspec !== "")
      data.q_date = '2010-01-01';
    data.q_date = data.q_date === "" ? null : data.q_date;
    if (data.q_dspec === "")
      data.q_dspec = null;
    data.lim = 50;
    data.offs = 0;
    //console.log ( data );
    moModel.getViewRpc( model, data );
    return false;
  };
  return { 
    view () { return m(".pure-g",
      m(".pure-u-1-1", // data gets from this FORM fieldsl
        m("form.pure-form[id=talon_find]",
          m("fieldset",
            m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[name=q_tal][type='number']",
                  { placeholder: "Номер талона",
                    onupdate: v => v.dom.value = '' 
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
                m("input.input-find.pure-u-2-3[name=q_dspec][type='number']",
                  {placeholder:"Специалист (код)"}
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
                    onclick: findTalons
                  },
                "Найти"
                )
              )
            ]) // pure-g
          ) //fieldset
        ) //form
      )// u-1-1
    ); //pure-g;
    } //view
  }; //return
}
// clojure
export const vuTalonsList = function (vnode) {
  
  const talonz_hdr = {
    crd_num: ['Карта', 'link'],
    fam: ['ФИО'],
    tal_num: ['Талон', 'link'],
    open_date: ['Открыт'],
    close_date: ['Закрыт'],
    purp: ['Цель'],
    ds1: ['Диагноз'],
    spec: ['Спец'],
    code: ['Код'],
    family: ['Врач']
  };
  let model = moTalonsList.getModel();  
  moModel.getViewRpc(model, {}, restClinic.talons_cnt.url, restClinic.talons_cnt.method );
  
  const sort= '';
  
  const hdrMap= function(){
    return m('tr', [
      Object.keys(talonz_hdr).map( (column) => {
        let field = talonz_hdr[column];
        return field.length > 1 ? m('th.sortable',
          { data: column, onclick: sort },
          [field[0], m('i.fa.fa-sort.pl10')]
        ) : m('th', field[0]);
      }),
      m('th', "Удалить")
    ])
  };
  
  const listMap= function(s) {
    let fio = `${s['fam']} ${s['im']} ${s['ot']}`
    let tal= s.tal_num, crd= s.crd_num;
    return m('tr', [
      Object.keys(talonz_hdr).map( (column) => {
        //console.log(talonz_hdr[column]);
        let cell = column === 'fam' ? fio : s[column];
        let td = talonz_hdr[column].length === 2 ?
        /*
        m('td.choice.blue', {
          //data:  cell,
          onclick: column == "crd_num" ?
            e => { e.preventDefault(); toCard(crd); } :
            e => { e.preventDefault(); toTalon(tal, crd);}
        }, cell) */
        m('td.choice.blue', m(m.route.Link, {
          href: column == 'crd_num' ? `${clinicApi.cards}/${crd}`: `${clinicApi.talons}/${tal}/${crd}`,
        }, cell)) : m('td', cell);
        return td;
      }),
      m('td', m('i.fa.fa-minus-circle.choice.red', {
        data: s.tal_num,
        //onclick: m.withAttr( "data", vuForm.ddel)
      }) )
    ]);
  };
  
  
  return {
    
    oninit () {
      //this.model = moCardsList.getModel();
      //moCardsList.getList(model);
    },
    view () {
    //return m(tableView, {model: this.model , header: this.header }, [
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        //m(vuTheader, { header: headerString} ),
        m(talonFind, { model }),
        model.list[0] ? model.list[0].recount ?
          m('h1.blue', {style: "font-size: 1.5em;"},
            `${model.list[0].recount} записей в таблице`) : 
          m('table.pure-table.pure-table-bordered[id=find_table]', [
            m('thead', hdrMap() ),
            m('tbody', [model.list.map( listMap )] )
          ]) : m('h1.blue', {style: "font-size: 1.5em;"}, "Нет таких записей")
      ] : m(vuLoading); 
    }
  }; //return this object
}
