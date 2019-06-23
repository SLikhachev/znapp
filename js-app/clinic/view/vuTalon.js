// src/clinic/view/vuTalon.js

import { vuLoading } from '../../apps/view/vuApp.js';
import { clinicApi } from '../clinicApi.js';
import { moTalon } from '../model/moTalons.js';
import { moCard } from '../model/moCards.js';
import { tabsView, forTabs } from './vuTabs.js';
import { tof, ctf } from '../form/foForm.js';
/*
const card_fileds = [
  'crd_num', 'fam', 'im', 'ot', 'date_birth',
  'polis_ser', 'polis_num', 'smo',
  'dul_serial', 'dul_number',
  'mo_att'
];
*/
const talForm = function (vnode) {
  
  let tal= vnode.attrs.talon;
  let method = vnode.attrs.method;
  
  const talonSave = function(e) {
    // form send with forTabs onCreate function
    //console.log(tal);
    // check dul type
    /*
    let s= card.dul_serial, n= card.dul_number;
    s = s ? s.toString().length: 0;
    n = n ? n.toString().length: 0;
    if (s=== 0 && n=== 0) {
      card.dul_type= null;
    } */
    return moTalon.setTalon(tal);
   //return true;
  };
  
  return {
    //oninit() {
    //}, 
    view() {
    //console.log('talForm view');
    let tal_num= tal.tal_num ? tal.tal_num: 'Новый';
    return m(".pure-u-18-24", [
		m("form.pure-form.pure-form-stacked.tcard", { style: "font-size: 1.2em;",
      id: "talon", oncreate: forTabs, method: method}, [
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
            }, 
            "Иванопуло Н Н"
          ), 
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
              onclick: talonSave
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
  let card= vnode.attrs.card;
  let method= 'PATCH';
  //console.log(card);
  let ff = [
    'fam', 'im', 'ot', 'birth_date',
    'polis_ser', 'polis_num', 'smo'];
  
  const cardSave = function(e) {
    //console.log(card);
    e.preventDefault();
    moCard.setCard(card);
    return moCard.save(e);
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
         {style:"font-size: 1.2em;", id:"tal_card", onsubmit: cardSave, method: method },[
          //m(".legnd", `Карта № ${card.crd_num}`),
          ff.map( f => m(".pure-control-group", ctf(f, card)) ),
          m("span", `Приписан: ${mo}`),
          m("span", `Документ ${duls} ${duln}`),
          m('button.pure-button.pure-button-primary[type="submit"]',
            { //onclick: e => cardSave
          }, "Сохранить"),
        
       m('a.pure-button.', {
            href: `${clinicApi.cards}/${card.crd_num}`,
            oncreate: m.route.link,
            //onclick: (e) => m.route.set('/crads/add/'),
            style: "margin-left: 2em;"
            }, "Открыть карту" )
      ]), /*form*/
     
    ); //patz
    } // view
  }; // return
};
const talMain = function (vnode) {

  return {
    oninit (vnode) {
    //model = moTalon.getModel();
    },
    /*
    oncreate() {
    },
  
    onupdate() {
    },
    */
    view (vnode) {
      //console.log('talMain view');
      return m(".pure-g", {style: "padding-left: 4em;"}, [
        m(crdForm, {card: vnode.attrs.model.card} ), // only patch
        m(talForm, {talon: vnode.attrs.model.talon, method: vnode.attrs.method } )
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

const talPmu = function(vnode) {
  let pmu = vnode.attrs.model.pmu ? vnode.attrs.model.pmu: [];
  //tal_num int, date_usl date, code_usl varchar, kol_usl smallint,
  //exec_spec int, exec_doc int, exec_podr int, name varchar
  let pmu_hdr = {
      num_usl: ['Номер'],
      code_usl: ['Код услуги'],
      kol_usl: ['Кол-во'],
      name: ['Наименование'],
      exec_spec: ['Спец'],
      exec_doc: ['Спец код'],
      exec_podr: ['Подр'],
      tarif: ['Тариф 5/2']
  };

  return {

    listMap (s) {
      return m('tr', [
        Object.keys(pmu_hdr).map( (column) => m('td', s[column])),
        m('td', m('i.fa.fa-minus-circle.choice.red', {
          data: s.id,
        //onclick: m.withAttr( "data", vuForm.ddel)
        }) )
      ]);
    },

    view() {
       //console.log('talPara view');
      return m('table.pure-table.pure-table-bordered', [ m('thead', [
            m('tr', [
              Object.keys(pmu_hdr).map( column => m('th', pmu_hdr[column][0])),
              m('th', "Удалить")
            ])
          ]),
          m('tbody', [pmu.map( this.listMap )] )
        ])
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
  
  let model; //;
  let tabs = ['Талон', 'Направление', 'ДС', 'ПМУ'];
  let conts = [talMain, talNap, talDs, talPmu,];
  let { tal } = vnode.attrs;
 
  return {
    oninit () {
      model = moTalon.getModel();
    //talon = model.list ? model.list[0] : null;
    //console.log(pmu);
    },
    onbeforeupdate() {
    //console.log('update');
      model = moTalon.getModel();
    },
  
    view () {
      let method = isNaN(tal) || tal === 0 ? "POST": "PATCH";
      return model.error ? [ m(".error", model.error) ] :
        model.card ?
          m(tabsView, {model: model, tabs: tabs, conts: conts, method: method})
        : m(vuLoading);
    } 
  }; 
};


