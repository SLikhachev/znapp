// src/report/view/vuVolum.js

//import { vuTheader } from '../../apps/view/vuApp.js';
import { restApi } from '../reportApi.js';
import { task_rest, moModel } from '../model/moModel.js';
import { vuDataSheet } from './vuDataSheet.js';

const Form = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  
  const update = function (event) {
    //console.log('update');
    event.preventDefault();
    let form = document.getElementById("volume_form");
    return moModel.doSubmit(form, model, "POST");
  };
  
  const report = function (event) {
    //console.log('report');
    event.preventDefault();
    let form = document.getElementById("volume_form");
    return moModel.doSubmit(form, model, "GET");
  };

  const get_href = function(vnode, model) {
    return task_rest + vnode.state.task_get_url + model.file;
  }
  
  return {
  
  oninit(vnode) {
    vnode.state.task_get_url = restApi.volum.get_url;
    vnode.state.task_post_url = restApi.volum.post_url;
  },
  
  view(vnode) {
    //console.log(model);
    return [ m('.pure-g', [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked[id="volume_form"]',
            { action: vnode.state.task_post_url,
            }, [
          m('fieldset', [
            m('legend', "Расчет объемов"),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input[id="month"][type="month"][name="month"][reqired=required]')
            ]),
            m('.pure-controls', [
              m('label.pure-checkbox[for="test"]', [
                m('input[id="test"][type="checkbox"][name="test"]'),
                m('span', { style: "padding: 0px 5px 3px;"}, "Тест"),
              ])
            ]),
            m('.pure-controls', [
              m('button.pure-button[type="button"]',
                { style: "font-size: 1.2em",
                  onclick: update
                }, "Обновить"),
              m('button.pure-button.pure-button-primary[type="button"]',
                { style: "font-size: 1.2em; margin-left: 2em;",
                  onclick: report
                }, "Отчет")
            ])
          ])
        ])
      ]),
      m('.pure-u-2-3',
        model.error ? m('.error', model.error) :
        model.message ? m('.legend', ["Статус обработки",
          model.done ? m('div', [
            m('h4.blue', model.message),
            m('span.blue', {style: "font-size: 1.2em"}, "Файл отчета: "),
            m('a.pure-button', {href: get_href( vnode, model ), style: "font-size: 1.2 em"}, model.file ) 
          ]) : m('div', m('h4.blue', model.message))
        ]) : m('div')
      )
    ])
  ];
  }
}  
}


// clojure
const vuVolum = function (vnode) {
  //console.log(vnode.attrs.model.pg_url);
  let view = vuDataSheet(vnode);
  view.form = Form;
  return view;
}

export { vuVolum };

