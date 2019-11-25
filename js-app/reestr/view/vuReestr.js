// ./reestr/view/vuReestr.js
// make reestr zip

import { vuTheader, taskResp } from '../../apps/view/vuApp.js';
import { _month, _schema } from '../../apps/model/moModel.js';
import {reestrApi, taskReestr, restReestr} from '../reestrApi';
import { moModel } from '../model/moModel.js';
import { doTask, get_fref, vuDataSheet } from "./vuDataSheet";

const vuErrorsList = function (vnode) {

  const { header, struct, model } = vnode.attrs;
  const fref= get_fref();
  
  const listMap= s=> m('tr', [ Object.keys(struct).map(
    column=> m('td', fref( s, column ))
  ) ] );
  //vnode.attrs = {model.list, struct, header}
  const view = vuDataSheet( { attrs: { model: model, struct: struct, header: header  } } );
  return Object.assign( view, { listMap: listMap } );
}

const Form = function(vnode) {
  
  const {model, list_model }= vnode.attrs;
  const data= { month: _month(), pack: 1 };
  model.href= taskReestr.pack.get_url;
  
  const _submit = event=> doTask(event,
      moModel.doSubmit(event, _schema('task'), 'simple', model, data, "POST").then(() => {
        moModel.getList( _schema('pg_rest'), list_model, restReestr.xml.params);
      })
  );
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
  const list_model= {
    url: restReestr.xml.url,
    list: null ,
    error: null,
    quiet: true
  };
  const header= 'Ошибки при формировании';
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(Form, { model: vnode.attrs.model, list_model: list_model } ),
        m(vuErrorsList, { header: header, struct: vnode.attrs.struct, model: list_model } )
      ];
    }    
        
  };
}

