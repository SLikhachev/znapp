// ./report/view/vuHosp.js
// import EIR hosp file  -> transform it to XLSX book and download it

import { _month, _schema } from '../../apps/model/moModel.js';
import { moModel } from '../../apps/model/moFormModel.js';
import { file_field, form_file_dom } from '../../apps/form/customFields.js';
import { vuTheader, taskResp } from '../../apps/view/vuApp.js';
import { doTask } from "../../apps/view/vuDataSheet";
import { taskReport } from '../reportApi.js';


const Form = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  const data= { month: _month() };
  model.href= taskReport.hosp.get_url;
  
  const _submit= event=> doTask(event,
    moModel.formSubmit(event, _schema('task'), model, "POST")
  );
 

  return {
  
    view() {
    return m('div#task.pure-g', { style: "margin-bottom: 1.3em;" }, [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', 
            { oncreate: form_file_dom, onsubmit: _submit }, [
          m('fieldset', [
            m('legend', "Отчет из файла ЕИР"),
            m('.pure-control-group', file_field(data) ),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                 { value: data.month }
              )
            ]),
            m('.pure-controls', [
              m('label.pure-checkbox[for="test"]', [ 
                m('input[id="test"][type="checkbox"][name="test"]'),
                m('span', { style: "padding: 0px 5px 3px;"}, "Тестовый режим")
              ])
            ]),
            m('.pure-controls', [
              m('button.pure-button pure-button-primary[type="submit"]',
                { style: 'margin-top: 0.5em'}, "Загрузить")
            ])  
          ])
        ])
      ]),
      m('.pure-u-2-3',  [ taskResp(model) ])
    ]);
  }
  }
}


export const vuHosp = function (vnode) {
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(Form, { model: vnode.attrs.model } )
      ];
    }    
  }; 
}

