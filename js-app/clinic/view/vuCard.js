// src/clinic/view/vuCard.js

import { states } from '../../apps/appApi';
import { vuLoading } from '../../apps/view/vuApp';
import { tabsView } from './vuTabs.js';
import { crdEmpty } from './vuClinic';
import { crdMain } from './vuCardMain';

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
];

export const vuCard = () => {
  return {
    view() {
      return states().error ? [m(".error", states().error)] :
        states().options && states().data ?
          m(tabsView, { thisTabs: cardTabs }) : m(vuLoading);
    }
  };
};
