// src/clinic/view/vuTalon.js

import { vuLoading } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moModel.js';
import { restSprav } from '../../sprav/spravApi.js';
import { clinicApi, restClinic } from '../clinicApi.js';
import { moTalon, talonOpt } from '../model/moTalons.js';
import { moCard } from '../model/moCards.js';
import { tabsView, forTabs } from './vuTabs.js';
import { tof, ctf, ptf } from '../form/foForm.js';
/*
const card_fileds = [
  'crd_num', 'fam', 'im', 'ot', 'date_birth',
  'polis_ser', 'polis_num', 'smo',
  'dul_serial', 'dul_number',
  'mo_att'
];
*/
const talForm = function (vnode) {
  
  let { model, method }= vnode.attrs;
  let tal= model.talon;
  const tal_num= tal.tal_num; //? tal.tal_num: 'Новый';
  const data= talonOpt.data;
  const doc_fam= () => {
    let doc= Array.from(data.get('doctor')).find( d=> d.spec == tal.doc_spec && d.code == tal.doc_code );
    return doc.family ? doc.family : '';
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
          m(".pure-u-6-24", {
              style: "padding-top: 2em ; font-size: 1.2em; font-weight: 600"
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
          m('.pure-u-2-24', tof('char1', tal)),
          m('.pure-u-2-24', tof('ishod', tal)),
          m('.pure-u-2-24', tof('travma_type',tal)),
        //]),
        //m('.pure-g', [
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
  let { card }= vnode.attrs; // ref to talon model.card
  const model= {}; //local model
  const method= 'PATCH';
  //console.log(card);
  let ff = [
    'fam', 'im', 'ot', 'birth_date',
    'polis_ser', 'polis_num', 'smo'];
  
  const cardSave = function(e) {
    e.preventDefault();
    //saveCard(event, card, model, method) {
    return moCard.saveCard(e, card, model, method);
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
      m('span#card_message',
        model.save ? model.save.err ? m('span.red', model.save.msg) : '' : ''
      )
      
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
        m(crdForm, {card: model.card} ), // only patch
        m(talForm, {model: model, method: method } )
      ]);
    }
  }
};


const talNap = function(vnode) {
  let tal= vnode.attrs.model.talon;

  return {
    view() {
      return m("form.pure-form.pure-form-stacked.tcard",
        {style: "font-size: 1.2em;", id: "tal_nap"}, [
          m('fieldset', [
            m('legend', `Талон № ${tal.tal_num}`),
            m('legend.leg-sec', "Направление: лечение. диагностика, консультация"),

            m(".pure-g", [
              m(".pure-u-2-24", [
                m('label[for="npr_mo"]', "Код МО"),
                m('input.pure-u-22-24[name="naprlech"][type="text"][placeholder=""]', {
                  value: tal.npr_mo
                })
              ]),
              m(".pure-u-2-24", [
                m('label[for="npr_spec"]', "Спец"),
                m('input.pure-u-22-24[name="npr_spec"][type="text"][placeholder=""]', {
                  value: tal.npr_spec
                })
              ]),
              m(".pure-u-5-24", [
                m('label[for="naprlech"]', "Номер направления"),
                m('input.pure-u-22-24[name="naprlech"][type="text"]', {
                  value: tal.naprlech
                })
              ])
            ]),
            m('legend.leg-sec', "Госпитализация"),

            m(".pure-g", [
              m(".pure-u-2-24", [
                m('label[for="hosp_mo"]', "Код МО"),
                m('input.pure-u-22-24[name="hosp_mo"][type="text"][placeholder=""]', {
                  value: tal.hosp_mo
                })
              ]),
              m(".pure-u-5-24", [
                m('label[for="nsndhosp"]', "Номер направления"),
                m('input.pure-u-22-24[name="nsndhosp"][type="text"]', {
                  value: tal.nsndhosp
                })
              ]),
              m(".pure-u-8-24", [
                m('label[for="extr"]', { style: "margin-top: 2.2em;"}, [
                  m('input[name="extr"][type="checkbox"]', {
                    checked: tal.extr === 0 ? false : true,
                //style: "margin: 1em, 0 0"
                  }),
                  "Экстренно",
                ]),
              ])
            ]),


          ])
        ])
    }
  };
};

const pmuForm = function (vnode) {
  
  let { talon, pmu }= vnode.attrs.model;
  // form fields
  const fld= ['code_usl', 'ccode', 'grup'];
  // local form pmu obj
  const _pmu= {}, data= talonOpt.data;
  // local model obj
  const md= { url: `${restClinic.para_clin.url}`, method: 'POST' };
  
  const get_doc= spec=> {
    // if talon to this doctor spec then this doctor code
    if ( !talon.doc_spec || !talon.doc_code) return 0;
    if ( talon.doc_spec == spec) return talon.doc_code;
    // else first doc with this spec from all doctors
    let doc= Array.from(data.get('doctor')).find( d=> d.spec == spec);
    if ( doc ) return doc.code;
    return 0; // error
  };
  
  const preparePara= item=> {
    // item -> code_usl, name, code_podr, code_spec
    // para -> tal_num, date_usl, code_usl, kol_usl, exec_spec, exec_doc, exec_podr
    let exec_spec= parseInt( item.code_spec );
    
    if ( isNaN( exec_spec ) || exec_spec === 0)
      return { error: `Неверный код специалиста ПМУ ${item.code_usl}`}; //error 
    
    let exec_podr= item.code_podr ? item.code_podr : 281;
    
    let exec_doc= get_doc(exec_spec);
    if ( ! Boolean( exec_doc ))
      return { error: `Нет доктора по специальности: ${exec_spec}`}; //error   
    
    return {
      tal_num: talon.tal_num, date_usl: talon.open_date,
      code_usl: item.code_usl, kol_usl: 1, exec_podr: exec_podr,
      exec_spec: exec_spec, exec_doc: exec_doc, error: ''
    };
  };
  
  const on_submit = event=> {
    event.preventDefault();
    _pmu.error = _pmu.list = null;
    
    let q= fld.filter( f=> Boolean( _pmu[f] )); // field name
    //console.log(q);
    if ( q.length === 0 )
      return false;
    else
      q= q[0];
    
    let errors={};
    if ( q == 'grup' ) {
      _pmu.url= restSprav.grc.url;
      _pmu.method= 'POST'
      return moModel.getViewRpc(_pmu, { grup: _pmu[q] } ).then(t=> {
        if (_pmu.list.length === 0) return Promise.reject('Нет такой группы');
       
        let items= [];
        for ( let it of _pmu.list.values() ){
          let item= preparePara(it);
          if ( item.error ) {
            errors[item.error]= errors[item.error] ? errors[item.error] + 1 :  1; 
            continue;
          }
          delete item.error;
          items.push(item);
        };
        if (items.length === 0) return Promise.reject('Плохая группа ');
        // bulk insert
        md.headers= {Prefer: 'return=representation'};
        return moModel.getViewRpc(md, items);
      }).then(t=> {
        if ( ! Boolean(md.list) ) return Promise.reject('Empty response after PMU GRUP POST ');
        //let list= Arroy.from(md.list);
        for (let [idx, it] of md.list.entries() ){
          it.name= _pmu.list[idx].name;
          it.ccode= _pmu.list[idx].ccode;
          //console.log(it);
          pmu.push( it );
        }
      }).catch( err=> {
         _pmu.error= err;
         Object.keys(errors).map( e=> {
           _pmu.error= _pmu.error + ` ${e}: ${errors[e]}`; 
         });
      });
    }
    
    _pmu.url= `${restSprav.pmu.url}?${q}=eq.${_pmu[q]}`;
    
    return moModel.getList( _pmu ).then( t=>{
      // anyway returns Promise
      if (_pmu.list.length === 0) return Promise.reject('Нет таких ПМУ');
      md.item= preparePara( _pmu.list[0] );
      if ( md.item.error ) return Promise.reject(md.item.error);
      // promise
      // reutrn inserted object      
      md.headers= {Prefer: 'return=representation'};
      // promise
      return moModel.formSubmit(event, md, 'POST');
    // add this item to model.pmu
    }).then( res=>{
      if (res.length && res.length > 0) {
        //console.log(res);
        res[0].name= _pmu.list[0].name;
        res[0].ccode= _pmu.list[0].ccode;
        pmu.push( res[0] );
        //pmu= [...pmu, res[0] ];
        //console.log(pmu);
        //return true;
      } else
        return Promise.reject('Empty response after PMU ITEM POST ');
    }).catch( err => {
    // process error
      _pmu.error= err;
    });
  
  };
  return {
    view() {
      return [ m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit: on_submit },
            m("fieldset", m(".pure-g", [
              fld.map( f => m(".pure-u-1-4", ptf(f, _pmu) ) ),
              m(".pure-u-1-5", 
                m('button.pure-button.pure-button-primary[type="submit"]',
                  {style: 'margin-top: 1.7em'},
                  "Добавить")
              )
            ]))
          ) //form
        )), // u-1-2, g
        m('.pure-g', 
          m(".pure-u-1-2 ", 
            m('span#card_message', _pmu.error ? m('span.red', _pmu.error) : '')
          )
        )
      ];
    }// view
  }; //this object
}; //func


const talPmu = function(vnode) {
  
  let model= vnode.attrs.model;
  let pmu = model.pmu ? model.pmu: [];
  //tal_num int, date_usl date, code_usl varchar, kol_usl smallint,
  //exec_spec int, exec_doc int, exec_podr int, name varchar
  let pmu_hdr = {
      ccode: ['Номер'],
      code_usl: ['Код услуги'],
      kol_usl: ['Кол-во'],
      name: ['Наименование'],
      exec_spec: ['Спец'],
      exec_doc: ['Спец код'],
      exec_podr: ['Подр'],
      tarif: ['Тариф 5/2']
  };
  
  const kol_usl= e=> {
    let id= e.target.getAttribute('data');
    let p= pmu.find( el => el.id == id );
    let url= `${restClinic.para_clin.url}?id=eq.${id}`;
    return { p, url };
  };
  
  const add_kol_usl= e=> {
    let { p, url } = kol_usl(e);
    let md= {};
    return moModel.getViewRpc( md, { kol_usl: p.kol_usl }, url, 'PATCH' ).then( t=> {
       p.kol_usl += 1;
       return true;
    });
    //return false;    
  };
  const del_kol_usl= e=> {
    let { p, url } = kol_usl(e);
    let md= {};
    if (p.kol_usl == 1) {
      return moModel.getViewRpc( md, {}, url, 'DELETE' ).then( t => {
        //pmu= pmu.filter( el=> el.id != p.id );
        p.kol_usl=0;
        return true;
      });
    } else {
      return moModel.getViewRpc( md, { kol_usl: p.kol_usl }, url, 'PATCH' ).then( t=> {
         p.kol_usl -= 1;
         return true;
      });
    }
    return false;    
  };
  
  let hdrMap= function(){
    return m('tr', [
      Object.keys(pmu_hdr).map( column => m('th', pmu_hdr[column][0])),
      m('th', "Добавить"),
      m('th', "Удалить"),
    ]);
  };
  const listMap= function (s) {
      return s.kol_usl > 0 ? m('tr', { key: s.id }, [
        Object.keys(pmu_hdr).map( (column) => m('td', s[column])),
        m('td', m('i.fa.fa-plus-circle.choice', {
          style: "color: green;",
          data: s.id,
          onclick: add_kol_usl
        }) ),
        m('td', m('i.fa.fa-minus-circle.choice.red', {
          data: s.id,
          onclick: del_kol_usl
        }) )
      ]) : '';
  };
  
  return {
    view() {
       //console.log('talPara view');
      return [
        m(pmuForm, { model }),
        m('table.pure-table.pure-table-bordered', [
          m('thead', hdrMap()),
          m('tbody', [pmu.map( listMap )] )
        ])
      ];
    }
  };
}
const talDs = function(vnode) {
  let tal= vnode.attrs.model.talon;
  return {

    view() {
      return m("form.pure-form.pure-form-stacked.tcard",
        {style: "font-size: 1.2em;", id: "tal_ds"}, [
          m('fieldset', [
            m('legend', `Талон № ${tal.tal_num}`),
            m('legend.leg-sec', "Дневной стационар"),
            m(".pure-g", [
              m('.pure-u-2-24', [
                m('label[for="tdc"]', "Дн. стац"),
                m('input.pure-u-20-24[name="tdc"][type="text"]', {
                  value: tal.visit_daystac
                })
              ]),
              m('.pure-u-2-24', [
                m('label[for="tdc"]', "Стац. дом"),
                m('input.pure-u-20-24[name="tdc"][type="text"]', {
                  value: tal.visit_homstac
                })
              ]),
            ]),
            m(".pure-g", [
              m('.pure-u-2-24', [
                m('label[for="ksg"]', "КСГ"),
                m('input.pure-u-20-24[name="ksg"][type="text"]', {
                  value: tal.ksg
                })
              ]),
              m('.pure-u-2-24', [
                m('label[for="prof_k"]', "Пр. койки"),
                m('input.pure-u-20-24[name="prof_k"][type="text"]', {
                  value: tal.prof_k
                })
              ]),
              m('.pure-u-2-24', [
                m('label[for="sh"]', "Схема"),
                m('input.pure-u-20-24[name="sh"][type="text"]', {
                  value: tal.sh
                })
              ]),
            ]),
          ])
        ])
    }
  };
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


