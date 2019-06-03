// src/clinic/view/vuTalon.js

import { vuLoading } from '../../apps/view/vuApp.js';
import { moTalon } from '../model/moTalons.js';
import { moCard } from '../model/moCards.js';
import { tabsView, forTabs } from './vuTabs.js';

const talForm = function (vnode) {
  
  let tal = vnode.attrs.talon;
  tal = {tal_num: '123--456'};
  
  const month = function (val) {
    let d = new Date();
    return d.getMonth() + 1;
  };
  /*
  const help = function (link) {
    return m(".pure-u-1-24.aquest", 
      m('a.qhelp[href="#"]',
        m('i.fa.fa-question-circle.fa-lg') )
    ); 
  };
  */
  return {
  view() {
    return m(".pure-u-18-24", [
		m("form.pure-form.pure-form-stacked.tcard", { style: "font-size: 1.2em;",  id: "talon" }, [
			m("fieldset", [
        m('legend', `Талон № ${tal.tal_num}`),
        m(".pure-g", [
          m(".pure-u-4-24", [
            m('label[for="open_date"', "Открыт"),
            m('input.pure-u-22-24[name="open_date"][type="date"][required]', {
                style: "height: 45%",
                value: tal.open_date
            })	
          ]),	
          m(".pure-u-4-24", [
            m('label[for="close_date"]', "Закрыт"),
            m('input.pure-u-22-24[name="close_date"][type="date"][required]', {
                style: "height: 45%",
                value: tal.close_date
            })
            //<!--span class="pure-form-message">заполнить</span-->
          ]),
          m('.pure-u-6-24', [
            m('label.leg-sec[for="talon_month"]',{ style: "color: red;" }, "Месяц талона"),
            m('input.pure-u-6-24.tal_month[name="talon_month"]', {
              style: "height: 45%",
              type: "number",
              min: 1,
              max: 12,
              value: tal.tal_month ? tal.tal_month : month()
            })
          ]),
          m(".pure-u-8-24", [
            m('label[for="first_vflag"]', [
              m('input[name="first_vflad"][type="checkbox"]', {
                checked: tal.first_vflag === 0 ? false : true,
                style: "margin-right: 0.7em"
              }),
              "Первичный",
            ]),
            m('label[for="for_pom"]', [
              m('input[name="for_pom"][type="checkbox"]', {
                checked: tal.for_pom == 2 ? true : false,
                style: "margin-right: 0.7em"
              }),
              "Неотложный",
            ]),
            m('label[for="finality"]', [
              m('input[name="finality"][type="checkbox"]', {
                checked: tal.finality === 0 ? false : true,
                style: "margin-right: 0.7em"
              }),
              "Закончен",
            ]),
          ]),
        ]),
        
        m(".pure-g", [
          m(".pure-u-2-24", [
            m('label[for="ist_fin"]', "Оплата"),
            m('input.pure-u-18-24[name="ist_fin"][type="text"]', {
              //style: "height: 50%",
              value: tal.ist_fin
            })
          ]),
          m(".pure-u-2-24", [
            m('label[for="purp"]', "Цель"), 
            m('input.pure-u-18-24[name="purp"][type="text"]', {
               //style: "height: 50%"
               value: tal.purp
            })
          ]),
          m(".pure-u-2-24", [
            m('label[for="doc_spec"]', "Врач"),
            m('input.pure-u-22-24[name="doc_spec"][type="text"][placeholder="Спец"]',{
              value: tal.doc_spec
            })
          ]),
          m(".pure-u-2-24", [
            m('label[for="doc_code"', "Код "),
            m('input.pure-u-22-24[name="doc_code"][type="text"]', {
              value: tal.doc_code
            })
          ]),
          m(".pure-u-6-24", {
            style: "padding-top: 2em ; font-size: 1.2em; font-weight: 600"
            }, 
            "Иванопуло Н Н"
          ), 
        ]),

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
          ]),
        ]), 
        
        m('legend.leg-sec', "Визиты, дни"),
        
        m(".pure-g", [
          m('.pure-u-2-24', [
            m('label[for="visit_pol"]', "Амбул"),
            m('input.pure-u-20-24[name="visit_pol"][type="text"]', {
              value: tal.visit_pol
             })
          ]),
          m('.pure-u-2-24', [
            m('label[for="tdc"]', "На дом"),
            m('input.pure-u-20-24[name="tdc"][type="text"]', {
              value: tal.visit_home
            })
          ]),
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
        
        m('legend.leg-sec', "Дневной стационар"),
        
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
        
        m('legend.leg-sec', "Диагноз, результат"),
        
        m('.pure-g', [
          m('.pure-u-3-24', [
            m('label[for="ds1"]', "Осн. диагноз"),
            m('input.pure-u-20-24[name="ds1"][type="text"]'), {
              value: tal.ds1              
            }
          ]),
          m('.pure-u-2-24', [
            m('label[for="char1"]', "Характер"),
            m('input.pure-u-16-24[name="char1"][type="text"]'), {
              value: tal.char1
            }
          ]),
          m('.pure-u-2-24', [
            m('label[for="ishod"]', "Исход"),
            m('input.pure-u-16-24[name="ishod"][type="text"]'), {
              value: tal.ishod
            }
          ]),
          m('.pure-u-2-24', [
            m('label[for="travma_type"]', "Травма"),
            m('input.pure-u-14-24[name=" travma_type"][type="text"]'), {
              value: tal.travma_type
            }
          ]),
        ]),
        
        m('.pure-g', [
          m('.pure-u-3-24', [
            m('label[for="ds2"]', "Доп. диагноз"),
            m('input.pure-u-20-24[name="ds2"][type="text"]'), {
              value: tal.ds2
            }
          ]),
          m('.pure-u-2-24', [
            m('label[for="char2"]', "Характер"),
            m('input.pure-u-16-24[name="char2"][type="text"]'), {
              value: tal.char2
            }
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
      
      
      ]),

        
      
			m('fieldset', { style: "padding-left: 0%;" }, [
				m('.pure-u-3-24', { style: "margin-top: 5px;" }, 
          m('button.pure-button.pure-button-primary[type="button"]',
            { style: "font-size: 1.1em"},
          "Сохранить" )
        )
      ])
    ]),//- form --
  ]); //- 18-24 -
 } // view
 }
}
const crdForm = function (vnode) {
  let data = vnode.attrs.card, method = vnode.attrs.method;
  //console.log(card);
  let card = {
      crd_num: data.crd_num,
      fam: data.fam,
      im: data.im,
      ot: data.ot,
      birth_date: data.birth_date,
      dul_serial: data.dul_serial,
      dul_number: data.dul_number,
      polis_num: data.polis_num,
      smo: data.smo,
      mo_att: data.mo_att
    };
  return {
  view() {
    console.log('crdForm view')
    return m(".pure-u-6-24.patz-data", { style: "overflow: hidden; padding-right: 1em" },
      m(".legnd", `Карта № ${card.crd_num}`),
      m('form.tcard.pure-form.pure-form-stacked',
         {style:"font-size: 1.2em;", id:"card", oncreate: forTabs, method: method },[
          //m(".legnd", `Карта № ${card.crd_num}`),
          m(".pure-control-group", [
            m('input.pure-u-22-24[name="fam"][type="text"][required][autofocus]', {
              placeholder: 'Фамилия',
              value: card.fam ? card.fam : '',
              onblur: e => card.fam = e.target.value,
              tabindex: "1",
            })
          ]),
          m(".pure-control-group", [
            m('input.pure-u-22-24[name="im"][type="text"]', {
              placeholder: 'Имя',
              value: card.im ? card.im : '',
              onblur: e => card.im = e.target.value,
              tabindex: "2",
            })
          ]),
          m(".pure-control-group", [
            m('input.pure-u-22-24[name="ot"][type="text"]', {
              placeholder: 'Отчество',
              value: card.ot ? card.ot : '',
              onblur: e => card.ot = e.target.value,
              tabindex: "3",
            })
          ]),
          m(".pure-control-group", [
            m('label[for="birth_date"', 'Дата рождения'),
            m('input[name="birth_date"][type="date"]', {
              value: card.birth_date ? card.birth_date : '',
              onblur: e => card.birth_date = e.target.value,
              tabindex: "4",
            })
          ]),
          m(".pure-control-group", [
            m('label[for="polis_ser"', 'Полис'),
            m('input[name="polis_ser"][type="text"]', {
              placeholder: 'Серия',
              value: card.polis_ser ? card.polis_ser : '',
              onblur: e => card.polis_ser = e.target.value,
              tabindex: "5",
            })
          ]),
          m(".pure-control-group", [
            m('input[name="polis_num"][type="text"]', {
              placeholder: 'Номер',
              value: card.polis_num ? card.polis_num : '',
              onblur: e => card.polis_num = e.target.value,
              tabindex: "6",
            })
          ]),
          m(".pure-control-group", [
            m('label[for="smo"', 'CMO'),
            m('input[name="smo"][type="text"]', {
              value: card.smo ? card.smo : '',
              onblur: e => card.smo = e.target.value,
              tabindex: "7",
            })
          ]),
        m("span", `Приписан: ${card.mo_att}`),
        m("span", `Документ ${card.dul_serial} ${card.dul_number}`),
        m('button.pure-button.pure-button-primary[type="submit"]',
          { //onclick: cardSave
          }, "Сохранить"),
        
       m('a.pure-button.', {
            //href: [clinicApi.cards],
            //oncreate: m.route.link,
            //onclick: (e) => m.route.set('/crads/add/'),
            style: "margin-left: 2em;"
            }, "Открыть карту" )
      ]), /*form*/
     
    ); //patz
    } // view
  }; // return
}
const talMain = function (vnode) {
  
  let model;
  
  return {
  oninit () {
    model = moTalon.getModel();
  },
  /*
  oncreate() {
  },
  
  onupdate() {
  },
  */
  view () {
    console.log('talMain view');
    return m(".pure-g", [
      m(crdForm, { card: model.list[0], method: 'PATCH' } ),
      m(talForm, {talon: model.list[0], method: 'PATCH' } )
    ]); 
  }
}
}
const talCard = function(vnode) {
  return {
    view(vnode) {
       return  m('h2', "Карта");
    }
  };
}
const talOpt = function(vnode) {
  return {
    view(vnode) {
       return m('h2', "Дополнительно");
    }
  };
}
const talPara = function(vnode) {
  return {
    view(vnode) {
       return  m('h2', "Параклиника");
    }
  };
}

export const vuTalon = function(vnode) {
  //console.log(vnode.attrs);
  
  let model; //;
  let tabs = ['Талон', 'Параклиника', 'Дополнительно'];
  let conts = [talMain, talPara, talOpt];
  let { id } = vnode.attrs;
 
  return {  
  oninit () {
    model = moTalon.getModel();
    //talon = model.list ? model.list[0] : null;
    //console.log(model);
  },
  onbeforeupdate() {
    //console.log('update');
    model = moTalon.getModel();
  },
  
  view () {
    console.log('vuTalon view');
    if ( id == 'add' ) {
      //console.log(id);
      return model.data ?
        m(tabsView, {model: model, tabs: tabs, conts: conts, method: 'POST'})
      : m(vuLoading);
    }
    //return m(tabsView, {model: model, tabs: tabs, conts: conts, method: 'PATCH'})
    return model.error ? [ m(".error", model.error) ] :
      model.list ? //&& model.data ? 
        m(tabsView, {model: model, tabs: tabs, conts: conts, method: 'PATCH'})
      : m(vuLoading);
  } 
}
};

