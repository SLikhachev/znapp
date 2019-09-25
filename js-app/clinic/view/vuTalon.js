// src/clinic/view/vuTalon.js

import { vuDialog } from '../../apps/view/vuDialog.js';
import { vuLoading } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moModel.js';
import { restSprav } from '../../sprav/spravApi.js';
import { clinicApi, restClinic } from '../clinicApi.js';
import { moTalon, talonOpt } from '../model/moTalons.js';
import { moCard } from '../model/moCards.js';
import { tabsView, forTabs } from './vuTabs.js';
import { tof, ctf } from '../form/foForm.js';
import { talNap } from './vuTalNap.js';
import { talPmu } from './vuTalPmu.js';
import { talDs } from './vuTalDs.js';
import { checkDost, getName } from './vuCard.js';
/*
const card_fileds = [
  'crd_num', 'fam', 'im', 'ot', 'date_birth',
  'polis_ser', 'polis_num', 'smo',
  'dul_serial', 'dul_number',
  'mo_att'
];
*/

//export const getName = function(data, val, key, prop, name, text, first_word=false) {
  // data - optional data MAP
  // val - string fofom input tag value
  // key - key in data MAP to check
  // prop - table's colemn name to check
  // name - name of table's column to output from
  // text - String text to output if item not find
  // first_word - out only first word from named column
const talForm = function (vnode) {
  
  let { model, method }= vnode.attrs;
  let tal= model.talon;
  const tal_num= tal.tal_num ? tal.tal_num: 'Новый';
  const data= talonOpt.data;
  //console.log(data);
  const get_name=
    (val, key, prop, name, text, _word)=> getName( data, val, key, prop, name, text, _word );
  const doc_fam= ()=> {
    let doc;
    let fin= get_name(tal.ist_fin, 'ist_fin', 'id', 'name', 'Оплата?', false);
    //console.log(fin)
    let purp= get_name(tal.purp, 'purpose', 'id', 'name', 'Цель?', true);
    let doct= Array.from(data.get('doctor')).find( d=> d.spec == tal.doc_spec && d.code == tal.doc_code );
    if ( Boolean(doct) && Boolean(doct.family) )
      doc= m('span', doct.family);
    else
      doc= m('span.red', ' Доктор? ')
    return Array.of(fin, purp, doc);
  };
  
  const set_char = function(e) {
    let ch;
    if (Boolean(e.target.value )) {
      ch = Array.from(data.get('char_main')).find(item => item.id == e.target.value);
      if (Boolean(ch))
        tal.char1= ch.id;
    }
  };
  const talonSave = function(e) {
    e.preventDefault();
    //saveTalon(event, model, method)
    return moTalon.saveTalon(e, model, method);
  };
  
  return {
    view() {
    //console.log('talForm view');
    return m(".pure-u-18-24", [
		m("form.pure-form.pure-form-stacked.tcard", { style: "font-size: 1.2em;",
      id: "talon", oncreate: forTabs, onsubmit: talonSave}, [
			m('fieldset', [
        m('legend', `Талон № ${tal_num}`),
        m(".pure-g", [
          m(".pure-u-4-24", tof('open_date', tal)),
          m(".pure-u-4-24", tof('close_date', tal)),
          m('.pure-u-6-24', tof('talon_month', tal)),
          m(".pure-u-8-24", [ tof('first_vflag', tal), tof('for_pom', tal), tof('finality', tal) ]),
        ]),
        m(".pure-g", [
          m(".pure-u-2-24", tof('ist_fin', tal)),
          m(".pure-u-2-24", tof('purp', tal)),
          m(".pure-u-2-24", tof('doc_spec',tal)),
          m(".pure-u-2-24", tof('doc_code', tal)),
          m(".pure-u-10-24", {
              style: "padding-top: 2em ; font-size: 1.1em; font-weight: 500"
            }, doc_fam() ),
        ]),
        //m('legend.leg-sec', "Визиты, дни"),
        m(".pure-g", [
          m('.pure-u-2-24', tof('visit_pol', tal)),
          m('.pure-u-2-24', tof('visit_home', tal)),
          m(".pure-u-6-24", {
            style: "padding-top: 2em ; font-size: 1.2em; font-weight: 600"
            },
            "Количество посещений"
          ),
        ]),
        //m('legend.leg-sec', "Диагноз, результат"),
        m('.pure-g', [
          m('.pure-u-3-24', tof('ds1', tal)),
          m('.pure-u-2-24', [
            tof('char1', tal, {
              list:  "char",
              onblur: set_char
            }),
            m('datalist[id="char"]', [
              data.get('char_main').filter(c => c.id < 7).map(c=> {
                let ch = `${c.id}. ${c.name.split(' ')[0]}`;
                return m('option', ch);
              })
            ])
          ]),
          m('.pure-u-2-24', tof('ishod', tal)),
          m('.pure-u-2-24', tof('travma_type',tal)),
        ]),
        m('.pure-g', [
          m('.pure-u-3-24', tof('ds2', tal)),
          m('.pure-u-2-24', tof('char2', tal))
        ]),

      ]),

      m('fieldset', { style: "padding-left: 0%;" }, [
				m('.pure-u-3-24', { style: "margin-top: 5px;" }, 
          m('button.pure-button.pure-button-primary[type="submit"]',
            { style: "font-size: 1.1em",
              //onclick: talonSave
            },
          "Сохранить" )
        )
      ]) 
    ])//- form --
  ]); //- 18-24 -
 } // view
 }
};


const crdForm = function (vnode) {
  let { model }= vnode.attrs;
  let { card }= model; // ref to talon model.card
  //const model= {}; //local model
  const method= 'PATCH';
  //console.log(card);
  let ff = [
    'fam', 'im', 'ot', 'birth_date',
    'polis_ser', 'polis_num', 'smo'];
  
  const toSave= card=> {
    let dost= checkDost(card);
    if ( Boolean(dost) )
      return dost;
    return '';
  };
  
  const cardSave = function(e) {
    e.preventDefault();
    //saveCard(event, card, model, method) {
    
    model.save= toSave(card);
    if ( Boolean( model.save ) ) {
      vuDialog.open();
      return false;
    }
    return moCard.saveCard(e, card, model, method).catch(err=> {
      model.save = err;
      vuDialog.open();
    });
  };

  return {
    view() {
    //console.log('crdForm view')
      let duls= card.dul_serial ? card.dul_serial: '';
      let duln= card.dul_number ? card.dul_number: 'Нет';
      let mo= card.mo_att ? card.mo_att: '';
      //console.log(card);
      return m(".pure-u-6-24.patz-data", { style: "overflow: hidden; padding-right: 1em" },
        m(".legnd", `Карта № ${card.crd_num}`),
        m('form.tcard.pure-form.pure-form-stacked',
         {style:"font-size: 1.2em;", id:"tal_card", onsubmit: cardSave },[
          //m(".legnd", `Карта № ${card.crd_num}`),
          ff.map( f => m(".pure-control-group", ctf(f, card)) ),
          m("span", `Приписан: ${mo}`),
          m("span", `Документ ${duls} ${duln}`),
          m('button.pure-button.pure-button-primary[type="submit"]',
            { //onclick: e => cardSave
          }, "Сохранить"),
        
       m(m.route.Link, { selector: 'a.pure-button.', 
            href: `${clinicApi.cards}/${card.crd_num}`,
            style: "margin-left: 2em;"
            }, "Открыть карту" )
      ]), /*form*/
      /*
      m('span#card_message',
        model.save ? model.save.err ? m('span.red', model.save.msg) : '' : ''
      )
      */
    ); //patz
    } // view
  }; // return
};


const talMain = function (vnode) {
  let { model, method }= vnode.attrs;
  return {
    view () {
      //console.log('talMain view');
      return m(".pure-g", {style: "padding-left: 4em;"}, [
        m(crdForm, {model: model} ), // only patch
        m(talForm, {model: model, method: method } )
      ]);
    }
  }
};


export const vuTalon = function(vnode) {
  //console.log(vnode.attrs);
  
  let { tal, crd }= vnode.attrs;
  let model= moTalon.getModel(); //;
  let tabs= ['Талон', 'Направление', 'ДС', 'ПМУ'];
  let conts= [talMain, talNap, talDs, talPmu,];
  let t= parseInt(tal);
  const method = isNaN(t) || t === 0 ? "POST": "PATCH";
  moTalon.getTalon(model, crd, tal );
  
  return {
    /*
    oninit () {
    },
    onbeforeupdate() {
    },
    */
    view () {
      return model.error ? [ m(".error", model.error) ] :
        talonOpt.data.size > 0 && model.card ?
          m(tabsView, {model: model, tabs: tabs, conts: conts, method: method})
        : m(vuLoading);
    } 
  }; 
};


