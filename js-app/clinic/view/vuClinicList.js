// src/clinic/view/vuCardsList.js

'use strict';

import { states, disp } from '../../apps/appApi';
import { vuLoading, vuTheader } from '../../apps/view/vuApp.js';
import { vuListTable } from '../../apps/view/vuListTable';
import { makeTags } from '../../apps/form/makeTags';
import { cardPath } from '../defines/defCards';
import { tplPath } from '../defines/defTempls';

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

const itemButton = (path, text) =>  m(m.route.Link, {
  selector: 'a.pure-button.pure-button-primary',
  href: path('add'),
  style: "margin-left: 2em; font-size: 1.2em"
}, text);


const changeYear = e => {
  e.preventDefault();
  return disp(['year', e]);
};

const year = () => m(".pure-u-1-5", [ //{style: "float: left"}, [
  m('label[for=_year]', 
    { style: "padding: 2em; font-size: 1.2em" }, 'Год талонов'),
    m("input.input-find.pure-u-1-3[name=_year][type='number']", {
      value: states().year, onchange: changeYear,
      style: "font-size: 1.2em; font-weight: 600",
      min: 2010, max: 2030
    })
]);

const empty = () => '';
const newCard = () => itemButton(cardPath, "Новая карта");
const newTempl = () => itemButton(tplPath, "Новый");

const newItem = unit => {
  return {
    cards: newCard,
    talons: newCard,
    templs: newTempl
  }[unit] || empty;
};

const yearField = unit => {
  return {
    cards: year,
    talons: year,
  }[unit] || empty;
};


export const vuFetchForm = () => {

  let unit, itdef;

  const onsubmit = e => {
    e.preventDefault();
    return disp(['fetch', 'fetch']);
  };

  return {
    view(vnode) {
      ({unit, itdef} = vnode.attrs);
      return m('.pure-g',
        m('.pure-u-18-24',
          m("form.pure-form", { onsubmit },
            m('fieldset', m(".pure-g",
              [vnode.children],
              m(".pure-u-1-5", [
                m('button.pure-button[type="submit"]',
                  { style: "font-size: 1.2em" }, "Найти"),
                newItem(unit)()
              ]),
              yearField(unit)()
            ))
          )
        ));
    }
  };
};


// clojure
export const vuClinicList = function () {

  let defs, unit, def, itdef, fetch, _table;

  const subHdr = text => R.isNil(text) ? '' :
   m('h1.blue', { style: "font-size: 1.5em;" }, `${text} записей в таблице`);

  const vuTable = vuListTable({ itdef, list: states().list });

  const table = list => _table ?
    (R.isEmpty(list) ?
      m('h1.blue', { style: "font-size: 1.5em;" }, "Нет таких записей") :
      m(vuTable, { itdef, list })
    ) : '';

  return {

    view() {
      defs = states().suite || {};
      unit = states().unit || '';
      def = defs[unit] || {};
      itdef = def.item || {};
      fetch = def.fetch || {};
      _table = states().table;
      //console.log(itdef);
      
      return m('div', { style: "padding-left: 2em" }, [
        m(vuTheader, { itdef }),
        m(vuFetchForm, { unit, itdef },
          m(vuFetchFormChildren, { fetch })
        ),
        subHdr(states().count),
        states().error ? m(".error", states().error) :
          states().list ? table(states().list) : m(vuLoading)
      ]);
    }
  };
};
