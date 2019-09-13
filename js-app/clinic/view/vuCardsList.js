// src/clinic/view/vuCardsList.js

import { vuLoading } from '../../apps/view/vuApp.js';
import { restClinic, clinicApi } from '../clinicApi.js';
import { moModel } from '../../apps/model/moModel.js';
import { moCardsList } from '../model/moCards.js';

const cardFind= function (vnode) {

  let { model } = vnode.attrs; 
  let href= [clinicApi.card_add];
  
  const findCards= function(event) {  
    // button FIND click event handler callback 
    event.preventDefault();
    let data = moModel.getFormData( $('form#card_find') );
    //console.log ( data );
    //return false;
    data.lim = 50;
    data.offs = 1;
    moModel.getViewRpc( model, data );
    return false;
  };
  return {
    view () {
    //console.log(vnode.attrs);
    return m(".pure-g", [
      //m(".pure-u-2-12", m('a.pure-button.pure-button-primary', { href: `#!${clinicApi.card_add}`}, "Добавить")),
      m(".pure-u-18-24",
      // data gets from this FORM fieldsl
        m("form.pure-form[id=card_find]",
          m("fieldset",
            m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[name=q_crd][type='text']",
                  {placeholder: "Номер карты",
                  //onkeyup: m.withAttr("value", vmFind.setFind ),
                  //value: vmFind.toFind
                  }
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_fam][type='text']",
                  {placeholder:"Фамилия"}
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[name=q_im][type='text']",
                  {placeholder:"Имя"}
                )
              ),
              m(".pure-u-1-5",
                m('button.pure-button[type="button"]', {
                    //value: 0,
                    onclick: findCards
                  }, "Найти" ),
                m(m.route.Link, { selector: 'a.pure-button.pure-button-primary', 
                  href: href,
                  //oncreate: m.route.link,
                  style: "margin-left: 2em;"
                  }, "Новая карта" )
              ),
            ])
          )
        )
      ),
    ]);
  }
}
}

export const toCard = function (crd_num) {
    m.route.set(clinicApi.card_id, { crd: crd_num } );
    return false;
};

// clojure
export const vuCardsList = function (vnode) {
  
  const cardz_hdr = {
      crd_num: ['Карта'],
      fam: ['ФИО'],
      birth_date: ['Дата рождения'],
      polis_num: ['Номер полиса'] 
   };
  
  const model= moCardsList.getModel();
  const table_id = 'cards_list';
  moModel.getViewRpc(model, {}, restClinic.cards_cnt.url, restClinic.cards_cnt.method );
  const sort= '';
  
  const newTalon= (e) => {
    e.preventDefault();
    let crd= e.target.getAttribute('data');
    m.route.set(clinicApi.talon_id, { tal: 0, crd: crd} );
    return false;
    //return false;
  };
  
  const hdrMap= function(){
    return m('tr', [
      Object.keys(cardz_hdr).map( (column) => {
        let field = cardz_hdr[column];
        return field.length > 1 ? m('th.sortable',
          { data: column, onclick: sort },
          [field[0], m('i.fa.fa-sort.pl10')]
        ) : m('th', field[0]);
      }),
      m('th', "Новый талон")
    ]);
  };
  
  const listMap= function(s) {
    let fio = `${s['fam']} ${s['im']} ${s['ot']}`;
    let first = true;
    return m('tr', [
      Object.keys(cardz_hdr).map( (column) => {
        let cell = column === 'fam' ? fio : s[column];
        let td = first ? m('td.choice.blue', m (m.route.Link, {
          href: `${clinicApi.cards}/${cell}`,
          //oncreate: m.route.link
        }, cell)) : m('td', cell);
        first = false;
        return td;
      }),
      
      m('td', m('i.fa.fa-plus-circle.choice', {
        style: "color: green; font-size: 1.7em; underline: none",
        data: s['crd_num'],
        onclick: newTalon
        }) )
      ]);
  };
  
  return {
    
    view () {
      
      return model.error ? [ m(".error", model.error) ] :
        model.list ? m('div', { style: "padding-left: 2em"}, [
          //m(vuTheader, { header: headerString} ),
          m(cardFind, { model } ),
          model.list[0] ? model.list[0].recount ? m('div' , 
            m('h1.blue', {style: "font-size: 1.5em;"}, 
              `${model.list[0].recount} записей в таблице`)
          ) : m('table.pure-table.pure-table-bordered', { id: table_id }, [
            m('thead', hdrMap() ),
            m('tbody', [model.list.map( listMap )] )
          ]) : m('h1.blue', {style: "font-size: 1.5em;"}, "Нет таких записей")
      ]) : m(vuLoading); 
    }
  }; //return this object
}
