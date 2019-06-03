// src/clinic/view/vuCard.js

import { vuLoading } from '../../apps/view/vuApp.js';
import { moCard } from '../model/moCards.js';
import { clinicApi } from '../clinicApi.js';
import { tabsView, forTabs } from './vuTabs.js';

const crdMain = function(vnode) {
  //console.log(vnode.attrs);
  
  //const model = vnode.attrs.model;
  //const data = model.data;
  //const card = model.list ? model.list[0] : {};
  //const method = vnode.attrs.method;
  let model, data, card, method;
  let attrs = vnode.attrs;
  
  //console.log(card);
  //
  
  const cardSave = function(e) {
    //console.log(card);
    return moCard.setCard(card);
    //return true;
  };
  
  const num_digits = function(val) {
    try {
      if (val.toString().length == 16) return "Длина номера 16 цифр";
      return m('span.red', `Длина номера ${val.toString().length} цифр`);
    } catch (e) {
      return m('span.red', "Длина номера неизвестна");      
    }
  };
  const set_polis_num = function(e) {
     card.polis_num = e.target.value;
  };
  const set_dul = function(e) {
     card.dul_type = e.target.value;
  };
  const set_mo = function(e) {
     card.mo_att = e.target.value;
  };
  const set_smo = function(e) {
     let smo = parseInt(e.target.value);
     if ( isNaN(smo) ) card.smo = 250000; //this value subtracts from code in input
     else card.smo = smo + 250000;
  };
  const set_smo_okato = function(e) {
    if ( Boolean(card.smo) ) {
      let smo = Array.from( data.get('smo_local') ).find( item => item.code == card.smo );
      if ( Boolean(smo) ) {
        card.smo_okato = smo.okato;
        let o = Array.from( data.get('okato') ).find( item => item.okato == smo.okato );
        e.target.value = `${o.region}. ${o.name.split(' ')[0]}`;
        return false;
      }
    };
    if (Boolean(e.target.value )) {
      rg = e.target.value.split('.')[0];
      card.smo_okato = Array.from(data.get('okato')).find(item => item.region.toString() == rg)['okato'];
    }
  };
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
      model = attrs.model;
      data = model.data;
      card = model.list ? Object.assign({}, model.list[0]) : new Object();
      method = attrs.method;
      //console.log(card);
    },
    
    view() {
      //console.log(method);
       return m('form.tcard.pure-form.pure-form-aligned',
         {style:"font-size: 1.2em;", id:"card", oncreate: forTabs, method: method },
         [ m('fieldset', [ m('legend', "Карта пациента"),
          m(".pure-g", [
            m(".pure-u-7-24", [
// --            
              m(".pure-control-group", [
                m('label', { for: "crd_num" }, "Номер карты"),
                m('input[name="crd_num"][type="text"][required][autofocus]', {
                  value: card.crd_num ? card.crd_num : '',
                  tabindex: "1",
                  //oncreate: toFocus,
                  onblur: e => card.crd_num = e.target.value,
                })
              ]),
// --            
              m(".pure-control-group", [
                m('label', { for:"fam"} , " "),
                m('input[name="fam"][type="text"][required]', {
                  placeholder: "Фамилия",
                  value: card.fam ? card.fam : '',
                  onblur: e => card.fam = e.target.value,
                  tabindex: "2",
                })
              ]),
// --            
              m(".pure-control-group", [
                m('label', { for: "im" }, " "),
                m('input[name="im"][type="text"]', {
                  placeholder: "Имя",
                  value: card.im ? card.im: '',
                  onblur: e => card.im = e.target.value,
                  tabindex: "3",
                })
              ]),
// --    
              m('.pure-control-group', [
                m('label', { for: "ot" }, " "),
                m('input[name="ot"][type="text"]', {
                  placeholder: "Отчество",
                  value: card.ot ? card.ot: '',
                  onblur: e => card.ot = e.target.value,
                  tabindex: "4",
                }) 
              ]),
// --          	
              m(".pure-control-group", [
                m('label', { for: "birth_date" }, "Дата рождения"),
                m('input[name="birth_date"][type="date"][required]', {
                  value: card.birth_date ? card.birth_date: '',
                  onblur: e => card.birth_date = e.target.value,
                  tabindex: "5",
                })
              ]),
// --            
              m(".pure-control-group", [
                m('label', { for: "gender" }, "Пол"),
                m('span', { style: "line-height: 1em;" }, "М"), 
                m('input[name="gender"][type="radio"]', {
                  style: "margin: 0 14px 0 7px;",
                  value: 0,
                  checked: card.gender ? ['м', 'ж'].indexOf( card.gender.toLowerCase() ) === 0 ? true : false : false,
                  onchange: e => e.target.checked ? card.gender = 'м' :  card.gender = 'ж' 
                }),
                m('span', "Ж"),
                m('input[name="gender"][type="radio"]', {
                  style: "margin: 0 0 0 7px;",
                  value: 1,
                  checked: card.gender ? ['м', 'ж'].indexOf( card.gender.toLowerCase() ) == 1 ? true: false: false,
                  onchange: e => e.target.checked ? card.gender = 'ж' : card.gender = 'м' 
                })
              ]),  
// --            
              m(".pure-control-group", [
                m('label', { for:"dul_type"}, "Тип документа"),
                m('input.pure-u-1-6[name="dul_type"][type="text"]', {
                  //list: "type_dul",
                  value: card.dul_type ? card.dul_type : '',
                  tabindex: "6",
                  onblur: set_dul
                }),
                m('span.item_name', set_name (card.dul_type, 'dul', 'code', 'short_name') )
              ]),
// --            
              m(".pure-control-group", [
                m('label', { for: "dul_serial" }, "Документ"),
                m('input[name="dul_serial"][type="text"]', {
                  placeholder: "Серия",
                  value: card.dul_serial ? card.dul_serial: '',
                  tabindex: "7",
                  onblur: e => card.dul_serial = e.target.value,
                })
              ]),
// --             
              m(".pure-control-group", [
                m('label', { for:"dul_number" }, " "),
                m('input[name="dul_number"][type="text"]', {
                  placeholder: "Номер",
                  value: card.dul_number ? card.dul_number: '',
                  tabindex: "8",
                  onblur: e => card.dul_number = e.target.value,
                })
              ])
            ]), // u-7-24
// ============================			
            m(".pure-u-8-24", [ m('legend', "ОМС"),
              m(".pure-control-group", [
                m('label', { for: "polis_ser" }, "Полис" ),
                m('input.pure-u-1-6[name="polis_ser"][type="text"]', {
                  placeholder:"Серия",
                  value: card.polis_ser ? card.polis_ser: '',
                  tabindex: "9",
                  onblur: e => card.polis_ser = e.target.value,
                }),
                m('input.pure-u-3-6[name="polis_num"][type="text"]', {
                  placeholder:"Номер",
                  value: card.polis_num ? card.polis_num: '',
                  tabindex: "10",
                  onblur: set_polis_num
                }),
                m('div.item_name', {style: "margin-left: 10em;"}, num_digits (card.polis_num) ),
              ]),
// --    
              m(".pure-control-group", [
                m('label', { for: "smo"}, "Страховщик"),
                m('input.pure-u-1-6[name="smo"][type="text"]', {
                  value: card.smo ? card.smo - 250000: '',
                  tabindex: "11",
                  onblur: set_smo
                }),
                m('span.item_name', set_name (card.smo, 'smo_local', 'code', 'short_name') )
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
               //m('span.item_name', set_name(card.smo_okato, 'okato', 'okato', 'name', true) )
                m('datalist[id="okato"]', [
                  data.get('okato').map( o => {
                  let okato = `${o.region}. ${o.name.split(' ')[0]}`;
                    return m('option', okato );
                  })
                ])
              ]),
// --          
              m(".pure-control-group", [
                m('label', { for: "mo_att"}, "Прикреплен к МО"),
                m('input.pure-u-1-6[name="mo_att"][type="text"]', {
                  value: card.mo_att ? card.mo_att: '',
                  tabindex: "13",
                  onblur: set_mo
                }),
              ]),
              m('span.item_name', set_name (card.mo_att, 'mo_local', 'scode', 'sname') ),
            ]),
// ============================         
            m(".pure-u-9-24", [ m('legend', "Адрес"),
              m(".pure-control-group", [
                //<!--label for="-num">Город</label-->
                m('input[name="city_g"][type="text"]', {
                  placeholder: "Город",
                  value: card.city_g ? card.city_g: '',
                  tabindex: "14",
                  onblur: e => card.city_g = e.target.value,
                })
              ]),
// --
              m(".pure-control-group", [
              //<!--label for="-num">Улица</label-->
                m('input[name="street_g"][type="text"]',  {
                  placeholder: "Улица",
                  value: card.street_g ? card.street_g: '',
                  tabindex: "15",
                  onblur: e => card.street_g = e.target.value,
                }),
              ]),
// --
              m(".pure-control-group", [
                m('input.pure-u-1-8[name="home_g"][type="text"]', {
                  placeholder: "Дом",
                  value: card.home_g ? card.home_g: '',
                  tabindex: "16",
                  onblur: e => card.home_g = e.target.value,
                }),
                m('input.pure-u-1-8[name="corp_g"][type="text"]', {
                  placeholder: "Корп",
                  value: card.corp_g ? card.corp_g: '',
                  tabindex: "17",
                  onblur: e => card.corp_g = e.target.value,
                }),
                m('input.pure-u-1-8[name="flat_g"][type="text"]', {
                  placeholder: "Кв",
                  value: card.flat_g  ? card.flat_g: '',
                  tabindex: "18",
                  onblur: e => card.flat_g = e.target.value,
                })
              ]),
// --
              m(".pure-control-group", [
                m('input[name="phone_1"]', {
                  type: "text",
                  placeholder: "Мобильный тел",
                  value: card.phone_wrk ? card.phone_wrk: '',
                  //pattern: "([0-9]{3}) [0-9]{3}-[0-9]{4}",
                  tabindex: "19",
                  onblur: e => card.phone_wrk = e.target.value,
                })
              ]),
// --     
              m(".pure-control-group", [
                m('input[name="phone_2"][type="text"]', {
                  placeholder: "Контактный тел",
                  value: card.phone_hom ? card.phone_hom: '',
                  tabindex: "20",
                  onblur: e => card.phone_hom = e.target.value,
                })
              ]),
            ]) //u-9-24
// ============================
          ]) // pure-g
        ]), // fieldset
// ============================
        m(".pure-g", [
            m(".pure-u-13-24 ", [
            m('span#card_message', model.save ? model.save.ok ? model.save.msg : m('span.red', model.save.msg) : '')
          ]),
        m(".pure-u-9-24 ", [
          m('button.pure-button.pure-button-primary[type="submit"]',
            { //onfocus: setPale,
              onclick: cardSave
              //tetabindex: "20",
            }, "Сохранить"),
          m('a.pure-button.', {
            href: [clinicApi.cards],
            oncreate: m.route.link,
            //onclick: (e) => m.route.set('/crads/add/'),
            style: "margin-left: 2em;"
            }, "Добавить новую" )
        ])
      ]) // pure-g
    ]);// form
//=========================
  }
}
}
const crdOpt = function(vnode) {
  return {
    view(vnode) {
       return m('h2', "Дополнительно");
    }
  }
}
const crdAtt = function(vnode) {
  return {
    view(vnode) {
       return  m('h2', "Прикрепить");
    }
  }
}

export const vuCard = function(vnode) {
  //console.log(vnode.attrs);
  
  let model; //, card;
  let tabs = ['Карта', 'Дополнительно', 'Прикрепить'];
  let conts = [crdMain, crdOpt, crdAtt];
  let { id } = vnode.attrs;
 
  return {  
  oninit () {
    model = moCard.getModel();
    //card = model.list ? model.list[0] : null;
    //console.log(model);
  },
  onbeforeupdate() {
    //console.log('update');
    model = moCard.getModel();
  },
  
  view () {

    if ( id == 'add' ) {
      //console.log(id);
      return model.data ?
        m(tabsView, {model: model, tabs: tabs, conts: conts, method: 'POST'})
      : m(vuLoading);
    }
    
    return model.error ? [ m(".error", model.error) ] :
      model.list && model.data ? 
        m(tabsView, {model: model, tabs: tabs, conts: conts, method: 'PATCH'})
      : m(vuLoading);
  } 
}
};
