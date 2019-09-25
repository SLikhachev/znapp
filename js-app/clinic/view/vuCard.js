// src/clinic/view/vuCard.js

import { vuDialog } from '../../apps/view/vuDialog.js';
import { vuLoading } from '../../apps/view/vuApp.js';
import { _region } from '../../apps/model/moModel.js';
import { moCard, cardOpt } from '../model/moCards.js';
import { clinicApi } from '../clinicApi.js';
import { tabsView, forTabs } from './vuTabs.js';
import { cof } from '../form/foForm.js';

const crdMain = function(vnode) {

  let { model, method }= vnode.attrs;
  const data= cardOpt.data;
  //const card = model.card ? Object.assign({}, model.card[0]) : {};
  const card= model.card ? model.card[0] : {};
  card.old_card= card.crd_num;
  const _reg= _region();
  if (card.smo !== null)
    if( card.smo >= _reg)
      card.smo -= _reg;
  //console.log(card.smo);
  //const crd= Boolean(card.crd_num);
  
  const toSave= ()=> {
    //dost
    let dost= '';
    if ( !card.fam ) dost += '2_';
    if ( !card.im ) dost += '3_';
    if ( !card.ot ) dost += '1_';
    if ( !card.fam && !card.im )
      return 'Укажите Фамилию или Имя';
    if ( Boolean(dost) )
      card.dost= dost;
    
    // gender
    if ( !Boolean( card.gender ))
      return 'Укажите пол';
    
    // DUL
    if ( !card.dul_serial && !card.dul_number )
      card.dul_type= null;
    if ( Boolean(card.polis_type) && card.polis_type < 3 && !Boolean(card.dul_type) )
      return 'Для этого типа полиса требуются данные ДУЛ';
    
    // SMO
    if ( card.smo === null && card.smo_okato === null)
      return 'Укажите либо СМО либо СМО ОКАТО';
    //if ( card.smo < _reg)
    //  card.smo += _reg;
    
    // city_g
    if ( !card.city_g && Boolean(card.street_g) )
      return 'Укажите город';
    
    // nulled empty int values 
    ['mo_att'].forEach( k=> {
      if ( !Boolean( card[k] ) )
        card[k]= null;
    });
    
    return false;
  };
  
  const cardSave= function(e) {
    e.preventDefault();
    // form send with forTabs onCreate function
    // above changed all processing will made here
    //console.log(card);
    model.save= toSave();
    if ( Boolean( model.save ) ) {
      vuDialog.open();
      return false;
    }
    //model.save= null;
    return moCard.saveCard(e, card, model, method).then(t=>
       m.route.set([clinicApi.cards])
    ).catch(err=> {
      model.save = err;
      vuDialog.open();
    });
  };
  // gender
  const gnd = function(c){
    return ['м', 'ж'].indexOf( c.gender.toLowerCase() );
  };
  // polis num digits
  const num_digits = function(card) {
    let s= 0, n= 0;
    if ( card.polis_ser !== null)
      s= card.polis_ser.toString().length;
    if ( card.polis_num !== null)
      n= card.polis_num.toString().length;
    try {
      if (s === 0 && n === 16) {
        card.polis_type = 3;
        return "ЕНП 16 цифр";
      }
      if (s === 0 && n > 0 && n < 16) {
        card.polis_type = 2;
        return `Временное свидетельсто ${n} цифр`;
      }
      if (s > 0 && n > 0) {
        card.polis_type = 1;
        return `Старый полис ${n} цифр`;
      }
      card.polis_type = null;
      return m('span.red', `Кривой полис ${n} цифр`);
    } catch (e) {
      return m('span.red', "Тип полиса неизвестен");
    }
  };
  // set smo
  const set_smo = function(e) {
     let smo = parseInt(e.target.value);
     if ( isNaN(smo) ) card.smo = 0; //this value subtracts from code in input
     else card.smo = smo; // + _reg;
     //console.log(card.smo); 
  };
  // smo OKATO
  const set_smo_okato = function(e) {
    if ( Boolean(card.smo) ) {
      let _smo= card.smo + _reg;
      let smo = Array.from( data.get('smo_local') ).find( item => item.code == _smo );
      if ( Boolean(smo) ) {
        card.smo_okato = smo.okato;
        let o = Array.from( data.get('okato') ).find( item => item.okato == smo.okato );
        e.target.value = `${o.region}. ${o.name.split(' ')[0]}`;
        return false;
      }
    }
    if (Boolean(e.target.value )) {
      rg = e.target.value.split('.')[0];
      card.smo_okato = Array.from(data.get('okato')).find(item => item.region.toString() == rg)['okato'];
    }
  };
  // gets the name of option from Map by key
  const set_name = function(val, key, prop, name, first_word=false) {
    //console.log(key, val);
    if ( !Boolean(val)) return "";
    let item = Array.from( data.get(key) ).find( item => item[prop].toString() == val );
    //console.log(item);
    if (item !== undefined) {
      if ( !first_word ) return item[name];
      return item[name].split(' ')[0];
    }
    return m('span.red', "Неизвестный код");
  };
  
  return {
    oninit() {
      //model = attrs.model;
      //data = model.data;
      //console.log(model.data);
      //console.log(model.map_data);
      // will be locale object yet
      //card = model.card ? Object.assign({}, model.card[0]) : {};
      //method = attrs.method;
      //console.log(card);
    },

    view: function () {
      //console.log(method);
      //let crd= Boolean (model.talons);
      //console.log(model.talons);
      return m('form.tcard.pure-form.pure-form-aligned',
        {style: "font-size: 1.2em;", id: "card", oncreate: forTabs, onsubmit: cardSave},
        [m('fieldset', [m('legend', "Карта пациента"),
          m(".pure-g", [
            m(".pure-u-7-24", [
// --        // -- TODO check for card.card_type to process card number    
              m(".pure-control-group", cof('crd_num', card,
                  { readonly: Boolean (model.talons.length) } )),
              m(".pure-control-group", cof('fam', card)),
              m(".pure-control-group", cof('im', card)),
              m('.pure-control-group', cof('ot', card)),
              m(".pure-control-group", cof('birth_date', card)),

              m(".pure-control-group", [
                m('label', {for: "gender"}, "Пол"),
                m('span', {style: "line-height: 1em;"}, "М"),
                m('input[name="gender"][type="radio"]', {
                  style: "margin: 0 14px 0 7px;",
                  value: 0,
                  checked: card.gender ? gnd(card) === 0 : false,
                  onchange: e => e.target.checked ? card.gender = 'м' : card.gender = 'ж'
                }),
                m('span', "Ж"),
                m('input[name="gender"][type="radio"]', {
                  style: "margin: 0 0 0 7px;",
                  value: 1,
                  checked: card.gender ? gnd(card) === 1 : false,
                  onchange: e => e.target.checked ? card.gender = 'ж' : card.gender = 'м'
                })
              ]),
// --            
              m(".pure-control-group", [cof('dul_type', card),
                m('span.item_name', set_name(card.dul_type, 'dul', 'code', 'short_name'))
              ]),
              m(".pure-control-group", cof('dul_serial', card)),
              m(".pure-control-group", cof('dul_number', card)),
            ]), // u-7-24
// ============================			
            m(".pure-u-8-24", [m('legend', "ОМС"),
              m(".pure-control-group", cof('polis_ser', card)),
              m(".pure-control-group", [cof('polis_num', card),
                m('div.item_name', {style: "margin-left: 10em;"}, num_digits(card)),
              ]),
              m(".pure-control-group", [
                cof('smo', card, {onblur: set_smo}),
                m('span.item_name',
                  card.smo === null ? '':  set_name(card.smo + _reg, 'smo_local', 'code', 'short_name'))
              ]),
// --
              m(".pure-control-group", [
                m('label', { for: "smo_okato"}, "Регион"),
                m('input[name="smo_okato"][type="text"]', {
                  oncreate: v => set_smo_okato( { target: v.dom} ),
                  list:  "okato",
                  //value: card.smo_okato,
                  tabindex: "12",
                  onblur: set_smo_okato
                }),
                //cof('smo_okato', card, {
                //  oncreate: v => set_smo_okato({target: v.dom}),
                //  onblur: set_smo_okato
                //}),
                //m('span.item_name', set_name(card.smo_okato, 'okato', 'okato', 'name', true) )
                m('datalist[id="okato"]', [
                  data.get('okato').map(o => {
                    let okato = `${o.region}. ${o.name.split(' ')[0]}`;
                    return m('option', okato);
                  })
                ])
              ]),
// --          
              m(".pure-control-group", [
                cof('mo_att', card),
                m('.item_name',
                  {style: "margin: 1em 0; padding-left: 1em"},
                  set_name(card.mo_att, 'mo_local', 'scode', 'sname') )
              ]),
            ]), //-- 8-24
// ============================         
            m(".pure-u-9-24", [m('legend', "Адрес"),
              m(".pure-control-group", cof('city_g', card)),
              m(".pure-control-group", cof('street_g', card)),
              m(".pure-control-group", [
                cof('home_g', card),
                cof('corp_g', card),
                cof('flat_g', card)
              ]),
              m(".pure-control-group", cof('phone_wrk', card)),
              m(".pure-control-group", cof('phone_hom', card))
            ]) //u-9-24
// ============================
          ]) // pure-g
        ]), // fieldset
// ============================
          m(".pure-g", [
            m(".pure-u-10-24 ", [
              m('span#card_message', '')
                //model.save ? model.save.ok ? model.save.msg : m('span.red', model.save.msg) : '')
            ]),
            m(".pure-u-14-24 ", [
              m('button.pure-button.pure-button-primary[type="submit"]',
                { //onfocus: setPale,
                  //onclick: cardSave
                  //tetabindex: "20",
                }, "Сохранить"),

              /*m('a.pure-button.', {
                href: [clinicApi.cards],
                oncreate: m.route.link,
                //onclick: (e) => m.route.set('/cards/0/'),
                style: "margin-left: 2em;"
              }, "Добавить новую")*/
            ])
          ]) // pure-g
        ]);// form
//=========================
    } // view
  }; // return
}; //func
const crdViz = function(vnode) {

  let crd = vnode.attrs.model.card[0].crd_num;
  //console.log(crd);
  let tal = vnode.attrs.model.talons ? vnode.attrs.model.talons: [];
  // tal_num int, open_date date, close_date date, purp smallint,
  //doc_spec int , doc_code int, family varchar,  ds1 varchar
  let tal_hdr = {
      tal_num: ['Номер талона', 'link'],
      open_date: ['Открыт'],
      close_date: ['Закрыт'],
      purp: ['Цель визита'],
      doc_spec: ['Спец'],
      doc_code: ['Спец код'],
      family: ['Доктор'],
      ds1: ['Диагноз']
  };

  return {

    listMap (s) {
      return m('tr', [
        Object.keys(tal_hdr).map( column => {
          let td = tal_hdr[column].length === 2 ?
            m('td.choice.blue', m(m.route.Link, {
              href: `${clinicApi.talons}/${s[column]}/${crd}`,
            }, s[column])) : m('td', s[column]);
          return td;
        })
      ]);
    },

    view() {
       //console.log('talPara view');
      return [m('.pure-g', m('.pure-u-1-1', m('table.pure-table.pure-table-bordered', [
          m('caption', 'Визиты в текущем году'),
          m('thead', [ m('tr', [
              Object.keys(tal_hdr).map( column => m('th', tal_hdr[column][0])),
            ])
          ]),
          m('tbody', [tal.map( this.listMap )] )
        ]) )),
        m('.pure-g', m('.pure-u-1-3',
          m(m.route.Link, { selector: 'a.pure-button.pure-button-primary',
            href: `${[clinicApi.talon_add]}${crd}`,
            style: "float: right; margin-top: 2em; font-size: 1.3 em"
            }, "Добавить талон")
          )
        )
      ]; // return
    } // view
  }; // return
};
const crdExt = function(vnode) {
  return {
    view(vnode) {
       return m('h2', "Дополнительно");
    }
  };
};
const crdAtt = function(vnode) {
  return {
    view(vnode) {
       return  m('h2', "Прикрепить");
    }
  };
}
const crdDel = function (vnode) {
  return {
    view(vnode) {
       return  m('h2', "Удалить/Объеденить");
    }
  };
}
export const vuCard = function(vnode) {
  //console.log(vnode.attrs);
  
  let tabs = ['Карта', 'Визиты', 'Дополнительно', 'Прикрепить', 'Удалить'];
  let conts = [crdMain, crdViz, crdExt, crdAtt, crdDel];
  const crd = parseInt(vnode.attrs.crd);
  const model= moCard.getModel();
  model.word= 'Карты';
  moCard.getCard( model, crd );
  const method = isNaN(crd) || crd === 0 ? "POST": "PATCH";
  
  return {  
    oninit () {
      //model = moCard.getModel();
      //card = model.list ? model.list[0] : null;
      //console.log(model);
    },
    onbeforeupdate() {
      //console.log('update');
      //model = moCard.getModel();
    },
  
    view () {
      return model.error ? [ m(".error", model.error) ] :
        cardOpt.data.size > 0 && model.card ? 
          m(tabsView, {model: model, tabs: tabs, conts: conts, method: method})
        : m(vuLoading);
    } 
  };
};
