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


const toSaveTalon= tal=> {
  
}


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
  const dsp= "^[A-Z][0-9]{2}(\.[0-9]{1,2})?$";
  const diag= new RegExp( dsp );
  const get_name=
    (val, key, prop, name, text, _word)=> getName( data, val, key, prop, name, text, _word );
  
  const doc_fam= ()=> {
    let doc, fin='';
    //let fin= get_name(tal.ist_fin, 'ist_fin', 'id', 'name', 'Оплата?', false);
    //console.log(fin)
    let purp= get_name(tal.purp, 'purpose', 'id', 'name', 'Цель?', true);
    let doct= Array.from(data.get('doctor')).find( d=> d.spec == tal.doc_spec && d.code == tal.doc_code );
    if ( Boolean(doct) && Boolean(doct.family) )
      doc= m('span', doct.family);
    else
      doc= m('span.red', ' Доктор? ')
    return Array.of(fin, purp, doc);
  };
  // c_zab (1,2,3) if ds1 <> Z
  //ishod ()
  // rslt 
  const set_data= (e, attr, table, prop)=> {
    let ch;
    if (Boolean(e.target.value )) {
      ch = Array.from(data.get(table)).find(item => item[prop] == e.target.value.split('.')[0]);
      if (Boolean(ch)) {
        tal[attr]= ch[prop];
        e.target.value= ch[prop];
      } else {
        tal[attr]= e.target.value;
      }
    }
    return false;
  };
  
  const data_list= (list, table) => m(`datalist[id=${list}]`,
    data.get(table).map(c=> m('option', { value: `${c.id}. ${c.name.split(' ')[0]}`} ) ) );
  
  const set_istfin= e=> set_data(e, 'ist_fin', 'ist_fin', 'id');
  const set_char= e=> set_data(e, 'char1', 'char_main', 'id');
  const set_ishod= e=> set_data(e, 'ishod', 'cishod', 'id');
  const set_result= e=> set_data(e, 'rslt', 'cresult', 'id');
  const set_travma= e=> set_data(e, 'travma_type', 'travma_type', 'id');
  
  let dvs= tal.ds1;
  const ds_model= { mkb: 'mkb10?code=like.', order_by: 'code', list: null, headers: { Range: '0-20' } };
  const ds_check= { url: 'mkb10?code=eq.', order_by: 'code', list: null }
  const set_diag= e=> {
    dvs = e.target.value;
    if ( diag.test(dvs) ) {
      ds_model.url = `${ds_model.mkb}${dvs}*`;
      return moModel.getList(ds_model);// .then(t=> console.log( ds_model.list ));
    }
    return false;
  };
  const ds_show= ()=> {
    let dsl= ds_model.list ? ds_model.list: [];
    let ds= dsl.find(d=> tal.ds1 == d.code.trim() );
    return ds ? ds.name: ''; // m('span.red', ' Диагноз? ');
  };
  
  const talonSave = function(e) {
    e.preventDefault();
    model.save= toSaveTalon(tal);
    if ( Boolean( model.save ) ) {
      vuDialog.open();
      return false;
    }
    //model.save= null;
    return moTalon.saveTalon(e, model, method).then(t=>
       m.route.set([clinicApi.talons])
    ).catch(err=> {
      model.save = err;
      vuDialog.open();
    });
  };
  
  return {
    view() {
    //console.log('talForm view');
    return m(".pure-u-18-24", [
		m("form.pure-form.pure-form-stacked.tcard", { style: "font-size: 1.2em;",
      id: "talon", oncreate: forTabs, onsubmit: talonSave}, [
			m('fieldset', [
        m('legend', `Талон № ${tal_num}`),
        //
        m(".pure-g", [
          m(".pure-u-4-24", tof('open_date', tal)),
          m(".pure-u-4-24", tof('close_date', tal)),
          m('.pure-u-6-24', tof('talon_month', tal)),
          m(".pure-u-6-24", [ tof('first_vflag', tal), tof('for_pom', tal), tof('finality', tal) ]),
        ]),
        //
        m(".pure-g", [
          m(".pure-u-2-24", [ tof('ist_fin', tal, { list: "istfin", onblur: set_istfin }),
            data_list('istfin', 'ist_fin')
          ]),
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
          m('.pure-u-3-24', [
            tof('ds1', tal, {
              //pattern: dsp, // "[A-Z][0-9]{2}(\.[0-9]{1})?",
              list: 'diags',
              value: dvs,
              oninput: set_diag
              //onchange: set_diag
            }),
            m('datalist[id="diags"]',
              ds_model.list ? ds_model.list.map(d=> m('option', {value: d.code.trim()})) : []
            )
          ]),
          m('.pure-u-3-24', [ tof('char1', tal, { list:  "char", onblur: set_char } ),
            m('datalist[id="char"]',
              data.get('char_main').filter(c => c.id < 4).map(c=>
                m('option', { value: `${c.id}. ${c.name.split(' ')[0]}` })
              )
            )
          ]),
          m('.pure-u-3-24', [ tof('ishod', tal, { list:  "ishod", onblur: set_ishod} ),
            data_list('ishod', 'cishod')
          ]),
          m('.pure-u-3-24', [ tof('rslt', tal, { list:  "result", onblur: set_result} ),
            data_list('result', 'cresult')
          ]),
          m(".pure-u-10-24", {
              style: "padding-top: 2em ; font-size: 1.1em; font-weight: 500"
            }, ds_show()
          ),
        ]),
        m('.pure-g', [
          m('.pure-u-3-24', tof('ds2', tal)),
          m('.pure-u-3-24', tof('char2', tal)),
          m('.pure-u-3-24', [ tof('travma_type', tal, { list:  "travma", onblur: set_travma }),
            data_list('travma', 'travma_type')
          ]),
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
  model.word= 'Талоны';
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


