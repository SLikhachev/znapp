// src/reestr/view/vuReestr.js

import { vuTheader } from '../../apps/view/vuApp.js';
import { file_field, form_file_dom } from '../../apps/form/customFields.js'
import { _month, _schema, moModel } from '../model/moModel.js';
//import { taskReestr } from '../reestrApi.js';
//import { task_rest, moModel } from '../model/moModel.js';

const errorsForm = function(vnode) {
  
  const model= vnode.attrs.model;
  const data= {};
  const schema= _schema('task');  
  const get_type= el=> el.options[ el.selectedIndex].value;
  
  const on_submit = function (event) {
    event.preventDefault();
    return moModel.formSubmit(event, schema, model, "POST");
  };
  
  const _on_submit = event=> {
    //console.log(data);
    event.preventDefault();
    data.type= data.type ? data.type: 1;
    console.log(data);
    //return false;
    return moModel.doSubmit(event, schema, 'simple', model, data, "POST");
  };
  
  return {
    view() {
      return m('.pure-g', [
        m('.pure-u-1-3', [
          m('form.pure-form.pure-form-stacked',
            { onsubmit: on_submit, oncreate: form_file_dom }, [
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
        m('.pure-u-2-3', [
          //m('progress[value=50][max=100]'),
          model.error ? m('.error', model.error) :
            model.message ? m('.legend', ["Статус обработки", 
              m('div', [

                m('h4.blue', model.message),
                m('span.blue', {style: "font-size: 1.2em"}, "Файл пакета: ", model.file ),
                model.detail ? m('h4.red', model.detail) : '',

              ])
            ]) : m('div')
        ])
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
        m(errorsForm, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
}

