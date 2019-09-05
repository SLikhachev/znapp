// src/reestr/view/vuReestr.js

import { vuTheader, foResp } from '../../apps/view/vuApp.js';
import { _month, _schema, moModel } from '../model/moModel.js';
import { taskReestr } from '../reestrApi.js';
//import { task_rest, moModel } from '../model/moModel.js';

const Form = function(vnode) {
  
  const model= vnode.attrs.model;
  model.href= taskReestr.pack.get_url;
  const data= { month: _month(), pack: 1 };
  const schema= _schema('task');
  
  const on_submit = event=> {
    event.preventDefault();
    let imp= document.getElementById('imp');
    imp.classList.add('disable');
    return moModel.doSubmit(event, schema, 'simple', model, data, "POST").then((t) => {
      imp.classList.remove('disable');
    });
  };
  
  return {
    view() {
      return m('div#imp.pure-g', [
        m('.pure-u-1-3', [
          m('form.pure-form.pure-form-stacked', { onsubmit: on_submit }, [
            m('fieldset', [
              m('legend', "Параметры реестра"),
              m('.pure-control-group', [
                m('label[for=month]', 'Месяц'),
                m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                  { value: data.month, onblur: e=> data.month = e.target.value }
                )
              ]),
              m('.pure-control-group', [
                m('label[for=pack]', 'Номер пакета'),
                m('input.fname[id="pack"][type="number"][min=1][name="pack"]',
                  { value: data.pack, onblur: e=> data.pack = e.target.value }
                )
              ]),
              m('.pure-controls', [
                m('label.pure-checkbox[for="sent"]', [ 
                  m('input[id="sent"][type="checkbox"][name="sent"]',
                    { value: data.sent, onblur: e=> data.sent = e.target.value }
                  ),
                  m('span', { style: "padding: 0px 5px 3px;"}, "Не отправлять принятые")
                ])
              ]),
              m('.pure-controls', [
                m('button.pure-button pure-button-primary[type="submit"]',
                  { style: 'margin-top: 0.5em'}, "Сформировать")
              ])  
            ])
          ])
        ]),
        m('.pure-u-2-3', foResp(model) )
      ]);
    }
  };
}


// clojure
export const vuReestr = function (vnode) {
  
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(Form, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
}

