// src/apps/form/taskForm.js

import { disp, states } from '../appApi';
import { taskResp } from '../view/vuApp';
import { form_file_node } from './customFields';

export const vuTaskForm = () => {

    let task = {}, form = {};

    const display = form => R.isEmpty(form) ? 'display: none' : 'display: block;';
    const oncreate = form_file_node, onupdate = form_file_node;

    const onsubmit = e => {
        e.preventDefault();
        disp(['task', e]);
        return false;
    };

    return {
        view(vnode) {
            ({ task } = vnode.attrs);
            form = task.form || {};

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

