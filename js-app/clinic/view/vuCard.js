// src/clinic/view/vuCard.js

//import { vuDialog } from '../../apps/view/vuDialog.js';
import { states, disp } from '../../apps/appApi';
//import { changedItem } from '../../apps/model/moListItem';
import { vuLoading } from '../../apps/view/vuApp';
import { makeTags } from '../../apps/form/makeTags';
import { validateCard } from '../model/moCards'; 
import { tabsView, nextTagFocus } from './vuTabs.js';
import { crdEmpty } from './vuClinic';


const makeFields = (fn, flds, ind) => flds.map((f, ix) => m('.pure-control-group', fn(f, ind*20+ix)));

const makeGroup = (group, ind) => m(group.class,
  makeFields(makeTags(group.fields), Object.keys(group.fields), ind)
);

const makeFormChildren = form => Object.keys(form).map( 
  (group, ind) => makeGroup(form[group], ind)
);


const crdMain = () => {
  /*
    const cardSave = function (e) {
      e.preventDefault();
      // form send with forTabs onCreate function
      // above changed all processing will made here
      //console.log(card);
      model.save = toSaveCard(card);
      if (Boolean(model.save)) {
        vuDialog.open();
        return false;
      }
      //model.save= null;
      return moCard.saveCard(e, card, model, method).then(t =>
        m.route.set([clinicApi.cards])
      ).catch(err => {
        model.save = err;
        vuDialog.open();
      });
    };
    
  */

  let form = {};

  const onsubmit = e => {
    e.preventDefault();
    return disp(['savecard']);
  };

  return {
    view() {
      form = states().suite.card.mainForm || {};

      return m('form.tcard.pure-form.pure-form-aligned',
        { style: "font-size: 1.2em;", id: "card", oncreate: nextTagFocus, onsubmit },
        m('fieldset', [
          m('legend', "Карта пациента"),
          m(".pure-g", makeFormChildren(form)),
          m(".pure-g", [
            m(".pure-u-10-24 ", m('span#card_message', '')),
            m(".pure-u-14-24 ",
              m('button.pure-button.pure-button-primary[type="submit"]',
                "Сохранить"),
            )
          ]) // pure-g
        ]))// form
      //=========================
    } // view
  }; // return
}; //func

/*
const crdViz = function (vnode) {
 
  let crd;
  if (vnode.attrs.model.card.length > 0)
    crd = vnode.attrs.model.card[0].crd_num;
  else
    crd = '';
  //console.log(crd);
  let tal = vnode.attrs.model.talons ? vnode.attrs.model.talons : [];
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
 
    listMap(s) {
      return m('tr', [
        Object.keys(tal_hdr).map(column => {
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
        m('thead', [m('tr', [
          Object.keys(tal_hdr).map(column => m('th', tal_hdr[column][0])),
        ])
        ]),
        m('tbody', [tal.map(this.listMap)])
      ]))),
      m('.pure-g', m('.pure-u-1-3',
        m(m.route.Link, {
          selector: 'a.pure-button.pure-button-primary',
          href: `${[clinicApi.talon_add]}${crd}`,
          style: "float: right; margin-top: 2em; font-size: 1.3 em"
        }, "Добавить талон")
      )
      )
      ]; // return
    } // view
  }; // return
};
*/

const cardTabs = [
  {
    name: "Карта",
    content() { return m(crdMain); }
  },
  crdEmpty("Визиты", "Визиты"),
  crdEmpty("Дополнительно", "Дополнительно"),
  crdEmpty("Прикрепить", "Прикрепить"),
  crdEmpty("Удалить", "Удалить/Объеденить"),
]

export const vuCard = () => {
  return {
    view() {
      return states().error ? [m(".error", states().error)] :
        states().options && states().data ?
          m(tabsView, { thisTabs: cardTabs }) : m(vuLoading);
    }
  };
};
