// src/clinic/view/vuCardsList.js

import { states, disp } from '../../apps/appApi';
import { vuLoading, vuTheader } from '../../apps/view/vuApp.js';
import { vuListTable } from '../../apps/view/vuListTable';
import { makeTags } from '../../apps/form/makeTags';
import { cards } from '../defines/defCards';

const makeFields = (fn, flds) => flds.map((f, idx) => m('.pure-u-1-5', fn(f, idx)));
//const makeButtons = (fn, flds) => flds.map((f, idx) => fn(f, idx));

//const checkAttrs = attrs => attrs && typeof attrs === 'object' ? attrs : {};

export const vuFetchFormChildren = () => {

  let fetch;

  return {
    view(vnode) {
      ({ fetch } = vnode.attrs);
      return makeFields(makeTags(fetch), Object.keys(fetch));
    }
  };
};


export const vuFetchForm = () => {

  let itdef;

  const onsubmit = e => {
    e.preventDefault();
    return disp(['fetch']);
  };

  return {
    view(vnode) {
      ({itdef} = vnode.attrs);
      return m('.pure-g',
        m('.pure-u-18-24',
          m("form.pure-form", { onsubmit },
            m('fieldset', m(".pure-g",
              [vnode.children],
              m(".pure-u-1-3", [
                m('button.pure-button[type="submit"]',
                  { style: "font-size: 1.2em" }, "Найти"),
                m(m.route.Link, {
                  selector: 'a.pure-button.pure-button-primary',
                  href: `${cards.path}${itdef.add}`,
                  style: "margin-left: 2em; font-size: 1.2em"
                }, "Новая карта")
              ])
            ))
          )
        ));
    }
  };
};


// clojure
export const vuCardsList = function () {

  //const model = moCardsList.getModel();
  //const table_id = moCardsList.crdTable();
  //moModel.getViewRpc(model, { _tbl: table_id }, restClinic.cards_cnt.url, restClinic.cards_cnt.method);
  /*
  const newTalon = (e) => {
    e.preventDefault();
    let crd = e.target.getAttribute('data');
    m.route.set(clinicApi.talon_id, { tal: 0, crd: crd });
    return false;
    //return false;
  };

  const hdrMap = function () {
    return m('tr', [
      Object.keys(cardz_hdr).map((column) => {
        let field = cardz_hdr[column];
        return field.length > 1 ? m('th.sortable',
          { data: column, onclick: sort },
          [field[0], m('i.fa.fa-sort.pl10')]
        ) : m('th', field[0]);
      }),
      m('th', "Новый талон")
    ]);
  };

  const listMap = function (s) {
    let fio = getFIO(s), first = true;
    return m('tr', [
      Object.keys(cardz_hdr).map((column) => {
        let cell = column === 'fam' ? fio : s[column];
        let td = first ? m('td.choice.blue', m(m.route.Link, {
          href: `${clinicApi.cards}/${cell}`,
          //oncreate: m.route.link
        }, cell)) : m('td', cell ? cell : '');
        first = false;
        return td;
      }),

      m('td', m('i.fa.fa-plus-circle.choice', {
        style: "color: green; font-size: 1.7em; underline: none",
        data: s['crd_num'],
        onclick: newTalon
      }))
    ]);
  };
  */
  let defs, def, itdef, fetch, _table;

  const subHdr = text => text ? m('h1.blue', { style: "font-size: 1.5em;" },
    `${text} записей в таблице`) : '';

  const vuTable = vuListTable({ itdef, list: states().list });

  const table = list => _table ?
    (R.isEmpty(list) ?
      m('h1.blue', { style: "font-size: 1.5em;" }, "Нет таких записей") :
      m(vuTable, { itdef, list })
    ) : '';

  return {

    view() {
      defs = states().suite || {};
      def = defs[states().unit] || {};
      itdef = def.item || {};
      fetch = def.fetch || {};
      _table = states().table;
      //console.log(itdef);
      return m('div', { style: "padding-left: 2em" }, [
        m(vuTheader, { itdef }),
        m(vuFetchForm, { itdef },
          m(vuFetchFormChildren, { fetch })
        ),
        subHdr(states().count),
        states().error ? m(".error", states().error) :
          states().list ? table(states().list) : m(vuLoading)
      ]);
    }
  };
};
