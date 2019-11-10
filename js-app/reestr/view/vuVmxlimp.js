// src/reestr/view/vuVmxlimp.js
// import errors from VM xml file

import { vuTheader, taskResp } from '../../apps/view/vuApp.js';
import { file_field, form_file_dom } from '../../apps/form/customFields.js';
import { _schema } from '../../apps/model/moModel.js';
import { moModel } from '../model/moModel.js';

const Form = function(vnode) {
  
  const model= vnode.attrs.model;
  const data= {};
  const get_type= el=> el.options[ el.selectedIndex].value;
  
  const _submit = function (event) {
    event.preventDefault();
    let task= document.getElementById('task');
    task.setAttribute('display', 'none');
    return moModel.formSubmit(event, _schema('task'), model, "POST").then(()=> {
      task.setAttribute('display', 'block');
    });
  };
  
  return {
    view() {
      return m('div#task.pure-g', { style: "margin-bottom: 1.3em;" }, [
        m('.pure-u-1-3', [
          m('form.pure-form.pure-form-stacked',
            { onsubmit: _submit, oncreate: form_file_dom }, [
            m('fieldset', [
              m('legend', "Тип файла ошибок"),
              m('.pure-control-group', file_field(data) ),
              m('.pure-control-group', [
                m('label[for=type]', 'Тип протокола'),
                m('select.ml10[name=type]',
                  { onblur: e=> data.type= get_type(e.target) }, [
                  m('option[value=1][selected]', 'Амбулаторный'),
                  m('option[value=2]', 'Онкология')
                ]),
              ]),
              m('.pure-controls', [
                m('button.pure-button pure-button-primary[type="submit"]',
                  { style: 'margin-top: 0.5em'}, "Импорт")
              ])  
            ])
          ])
        ]),
        m('.pure-u-2-3', [ taskResp(model) ] )
      ]);
    }
  };
}


// clojure
export const vuVmxlimp = function (vnode) {
  
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(Form, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
}

