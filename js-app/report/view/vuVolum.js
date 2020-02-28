// src/report/view/vuVolum.js

import { _month, _schema } from '../../apps/model/moModel.js';
import { taskResp, doTask} from '../../apps/view/vuApp.js';
import { vuDataSheet } from '../../apps/view/vuDataSheet';
import { moModel } from '../../apps/model/moFormModel.js';
import { taskReport } from '../reportApi.js';


const Form = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  const md= { month: _month(), url: taskReport.volum.post_url, href: taskReport.volum.get_url };
  const get_id= id=> document.getElementById(id);
  const _default= ()=> true;  
  
  const _submit = (event, method)=> {
    event.preventDefault();
    const _event= { target: get_id("volume_form"), preventDefault: _default  };
    return doTask( event, moModel.formSubmit(_event, _schema('task'), md, method) );
  };
  
  const _update= event=> _submit( event, "POST" );
  const _report= event=> _submit( event, "GET" );  

  
  
  return {
  
  view() {
    //console.log(model);
    return [ m('.pure-g', [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked[id="volume_form"]', [
          m('fieldset', [
            m('legend', "Расчет объемов"),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input[id="month"][type="month"][name="month"][reqired=required]',
                { value: md.month, onchange: e=> md.month = e.target.value }
              )
            ]),
            m('.pure-controls', [
              m('label.pure-checkbox[for="test"]', [
                m('input[id="test"][type="checkbox"][name="test"]'),
                m('span', { style: "padding: 0px 5px 3px;"}, "Тест"),
              ])
            ]),
            m('.pure-controls', [
              m('button.pure-button[type="button"]',
                { style: "font-size: 1.2em", onclick: _update }, "Обновить"),
              m('button.pure-button.pure-button-primary[type="button"]',
                { style: "font-size: 1.2em; margin-left: 2em;", onclick: _report }, "Отчет")
            ])
          ])
        ])
      ]),
      m('.pure-u-2-3', [ taskResp(md) ]  )
    ])
  ];
  }
}  
}

// clojure
export const vuVolum = function (vnode) {
  //console.log(vnode.attrs.model.pg_url);
  let view = vuDataSheet(vnode);
  view.form = Form;
  return view;
}


