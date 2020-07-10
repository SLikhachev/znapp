// src/sprav/form/spravForm.js

import { disp, states } from '../../apps/appApi';


export const vuFetchForm = () => {

  let def = {};

  const onadd = e => {
    e.preventDefault();
    disp(['add'])
  };
  const onsubmit = e => {
    e.preventDefault();
    disp(['fetch']);
    return false;
  };

  return {
    view(vnode) {
      ({ def } = vnode.attrs);

      return m('.pure-g',
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

