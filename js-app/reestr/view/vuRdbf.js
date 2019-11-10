// src/reestr/view/vuRdbf.js

import { vuTheader } from '../../apps/view/vuApp.js';
import { taskReestr } from '../reestrApi.js';
import { file_field, form_file_dom } from '../../apps/form/customFields.js';
import { _month, _schema } from '../../apps/model/moModel.js';
import { moModel } from '../model/moModel.js';

const importForm = function(vnode) {
  
  const model= vnode.attrs.model;
  const data= { month: _month() };
  const schema= _schema('task');  
  //console.log(model);
  
  const on_submit = function (event) {
    event.preventDefault();
    return moModel.formSubmit(event, schema, model, "POST");
  };
  
  return {

  view() {
    //console.log(model);
    return m('.pure-g', [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', 
            { onsubmit: on_submit, oncreate: form_file_dom }, [
          m('fieldset', [
            m('legend', "Импорт файлов реестров DBF"),
            m('.pure-control-group', file_field(data) ),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                 { value: data.month, onblur: e=> data.month = e.target.value }
              )
            ]),
            m('.pure-controls', [
              m('label.pure-checkbox[for="test"]', [ 
                m('input[id="test"][type="checkbox"][name="test"]',
                  { value: data.sent, onblur: e=> data.sent = e.target.value }
                ),
                m('span', { style: "padding: 0px 5px 3px;"}, "Тест")
              ])
            ]),
            m('.pure-controls', [
              m('button.pure-button pure-button-primary[type="submit"]',
                { style: 'margin-top: 0.5em'}, "Импорт")
            ])  
          ])
        ])
      ]),
      m('.pure-u-2-3', [
        model.error ? m('.error', model.error) :
          model.message ? m('.legend', ["Статус обработки", 
            m('div', [

              m('h4.blue', model.message),
              m('span.blue', {style: "font-size: 1.2em"}, "Исходный файл: ", model.file ),
              model.detail ? m('h4.red', model.detail) : '',

            ])
          ]) : m('div')
      ])
    ]);
  }
}
}

// clojure
export const vuRdbf = function (vnode) {
    
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(importForm, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
}

