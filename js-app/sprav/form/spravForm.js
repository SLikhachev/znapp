// src/sprav/form/spravForm.js

import { vuDialog } from '../../apps/view/vuDialog';
import { disp, states } from '../../apps/appApi';


const onadd = (e) => {
  e.preventDefault();
  disp(['add']);
  vuDialog.open();
};

export const vuFetchForm = () => {

  let def = {};

  const display = (def) => def.fetch ? 'display: block' : 'display: none;';
  const addButton = (def) => (def.item && def.item.editable
    && def.item.editable.indexOf('add') >= 0) ?
    'display: inline-block; margin-left: 1.0em' :
    'display: none;';

  const onsubmit = e => {
    e.preventDefault();
    disp(['fetch']);
    return false;
  };

  return {
    view(vnode) {
      ({ def } = vnode.attrs);

      return m('.pure-g', { style: display(def) },
        m(".pure-u-1-1",
          m("form.pure-form", { onsubmit },
            m('fieldset', [
              vnode.children,
              m('button.pure-button.pure-button-primary[type="submit"]',
                { style: 'margin-left: 1.0em' }, "Выбрать"),
              m('button.pure-button.pure-button-primary[type="button"]',
                { style: addButton(def), onclick: onadd }, "Добавить")
            ])
          )
        )
      )
    }
  }
};


// Forms in dialog window for catalogs
export const vuForm = (vnode) => {

  let { word, itdef } = vnode.attrs;

  const display = () => word ?
    { display: 'display: block', word } :
    { display: 'display: none', word: '' };

  const saverror = () => states().saverror ? //(saveResult() && saveResult().error) ?
    { display: 'display: block', msg: states().saverror } : // saveResult().error } :
    { display: 'display: none', msg: '' };

  const onsubmit = e => {
    // if not then in route we will see wrong path (method GET + all form fields)
    e.preventDefault();
    disp(['saveitem']);
    return false;
  };
  const formclass = () => itdef.formclass || 'pure-form-aligned';
  const form = () => `form.pure-form.${formclass()}`;

  return {
    view(vnode) {
      ({ word, itdef } = vnode.attrs);

      return [
        m(form(),//'formpure-form-aligned',
          { onsubmit }, [
          vnode.children,
          m('.pure-controls', { style: display().display },
            m('button.pure-button[type=submit]', display().word)
          )
        ]), // form
        m('div', { style: saverror().display }, [
          m('br'), m('span.red', 'Ошибка базы данных:'),
          m('br'), m('span.red', saverror().msg)
        ])
      ];
    }
  };
}


const vmFind = cols => {
  //cols: 2, // how many tr childern (table columns) get to find 
  //str: "", // string to find
  //if (fstr.length < 3) return true;
  return str => {
    $.each($('table#list_table tbody tr'), (_, tr) => {
      let subtr = $(tr).children().slice(0, cols);
      //console.log(subtr);
      if (subtr.text().toLowerCase().includes(str.toLowerCase())) {
        $(tr).show();
      } else {
        $(tr).hide();
      }
      m.redraw();
    }); return false;
  }
};


export const vuFindForm = vnode => {

  let { itdef } = vnode.attrs, fstr = m.stream('');
  let cols = itdef.find !== undefined ? itdef.find : 2;
  fstr.map(vmFind(cols)); //steam

  const display = c => c ? 'display: block' : 'display: none';
  const addButton = () => display(itdef.editable && itdef.editable.indexOf('add') >= 0)

  return {
    view(vnode) {
      ({ itdef } = vnode.attrs);
      cols = itdef.find !== undefined ? itdef.find : 2;
      return m(".pure-g", { style: display(cols) },
        m(".pure-u-1-1",
          m("form.pure-form",
            m("fieldset",
              m(".pure-g", [
                m(".pure-u-1-5",
                  m("input.input-find.pure-u-3-4[id='to-find'][type='search']",
                    {
                      placeholder: "найти число, слово",
                      onkeyup: e => fstr(e.target.value),
                      value: fstr()
                    }
                  )
                ),
                m(".pure-u-1-5", { style: addButton() },
                  m('button.pure-button.pure-button-primary[type="button"]', {
                    onclick: onadd
                  }, "Добавить")
                )
              ])
            )
          )
        )
      );
    }
  };
}


