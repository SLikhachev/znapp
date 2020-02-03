// ./report/view/vuMovemek.js
// 

import { vuTheader, doTask, taskResp } from '../../apps/view/vuApp.js';
import { _schema, _month } from '../../apps/model/moModel.js';
import { moModel } from '../../apps/model/moFormModel.js';
import { taskReestr } from '../reestrApi.js';


const Form = function() {
  
  const data= { month: _month() };
  
  //const model = vnode.attrs.model;
  //console.log(model);
  const md= { url: taskReestr.mek.post_url, href: taskReestr.mek.get_url };
  //const _test = event=> { event.preventDefault(); return false; };
  
  const _submit = event=> doTask(event,
    moModel.formSubmit(event, _schema('task'), md, "GET")
  );
  const _move = event=> doTask(event,
    moModel.doSubmit(event, _schema('task'), 'simple', md, data, "POST")
  );
    
  
  return { view() {
    return m('div#task.pure-g', { style: "margin-bottom: 1.3em;" }, [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', {onsubmit: _submit},
          m('fieldset', [
            m('legend', "Выгрузить отказанных по МЭК в CSV файл"),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                { value: data.month, onblur: e=> data.month = e.target.value }
              )
            ]),
            m('.pure-controls', [
              m('button.pure-button.pure-button-primary[type="submit"]',
                { style: "font-size: 1.0em; margin-top: 1em", }, "Выгрузить"),
              m('button.pure-button.pure-button[type="button"]',
                { style: "font-size: 1.0em; margin: 1em 0 0 2em",
                  onclick: _move
                }, "Перенести МЭКи на месяц вперед")
            ])
          ])
        )
      ]),
      m('.pure-u-2-3', taskResp(md) )
    ]);
  }};
};  


export const vuMovemek = function (vnode) {
  
  const { header }= vnode.attrs;
  
  return { view() {
    return [
      m(vuTheader, { header } ),
      m(Form, {} )
    ];
  }};
}

