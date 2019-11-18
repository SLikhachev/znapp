// ./reestr/view/vuReestr.js
// make reestr zip

import { vuTheader, taskResp } from '../../apps/view/vuApp.js';
import { _month, _schema } from '../../apps/model/moModel.js';
import { taskReestr } from '../reestrApi';
import { moModel } from '../model/moModel.js';

const Form = function(vnode) {
  
  const model= vnode.attrs.model;
  const data= { month: _month(), pack: 1 };
  model.href= taskReestr.pack.get_url;
  
  const _submit = event=> {
    //console.log(data);
    event.preventDefault();
    let task= document.getElementById('task');
    task.setAttribute('display', 'none');
    return moModel.doSubmit(event, _schema('task'), 'simple', model, data, "POST").then(()=> {
      task.setAttribute('display', 'block');
    });
  };
  
  return {
    view() {
      return m('div#task.pure-g', { style: "margin-bottom: 1.3em;" }, [
        m('.pure-u-1-3', [
          m('form.pure-form.pure-form-stacked', { onsubmit: _submit }, [
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
        m('.pure-u-2-3', [ taskResp(model) ] )
      ]);
    }
  };
}

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

