// src/sprav/view/vuSprav.js

import { disp, states } from '../../apps/appApi';
import { taskResp } from '../../apps/view/vuApp';
import { form_file_node } from '../../apps/form/customFields';

export const vuTaskForm = () => {

  let task = {}, form = {};

  const display = form => R.isEmpty(form) ? 'display: none' : 'display: block;';

  //const oncreate = form => form.file ? form_file_node : undefined;

  const onsubmit = e => {
    e.preventDefault();
    disp(['task', e]);
    return false;
  };

  return {
    view(vnode) {
      ({ task } = vnode.attrs);
      form = task.form || {};
      //const oncreate = form.file ? form_file_node : undefined;
      const oncreate = form_file_node;
      const onupdate = form_file_node;

      return m('.pure-g', { style: display(form) }, [
        m('.pure-u-1-3',
          m("form.pure-form.pure-form-stacked",
            { oncreate, onupdate, onsubmit },
            m('fieldset', [vnode.children])
          ),
        ),
        m('.pure-u-2-3', [taskResp(states())])
      ])
    }
  }
};

