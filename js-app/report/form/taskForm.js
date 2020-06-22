// src/sprav/view/vuSprav.js

//import { vuDialog } from '../../apps/view/vuDialog';
import { disp, states } from '../../apps/appApi';
//import { saveResult } from '../model/moModel';
//import { changeEvent, itemId, fetchEvent } from '../model/moModel';

export const vuTaskForm = () => {

  let task = {}, form = {};

  const display = form => R.isEmpty(form) ? 'display: block' : 'display: none;';

  const onsubmit = e => {
    e.preventDefault();
    disp([e.target.name]);
    return false;
  };

  return {
    view(vnode) {
      ({ task } = vnode.attrs);
      form = task.form || {};

      return m('.pure-g', { style: display(form) },
        m(".pure-u-1-1",
          m("form.pure-form.pure-form-stacked", { onsubmit },
            m('fieldset', [
              vnode.children,
            ])
          )
        )
      )
    }
  }
};

