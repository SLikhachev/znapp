// ./reestr/view/vuInvimp.js
// import BARS invoice -> transform it into xlsx book and download it

import { _schema } from '../../apps/model/moModel.js';
import { vuTheader, taskResp } from '../../apps/view/vuApp.js';
import { file_field, form_file_dom } from '../../apps/form/customFields.js';
import { moModel } from '../../apps/model/moFormModel.js';
import { doTask } from "../../apps/view/vuDataSheet";
import { taskReestr } from '../reestrApi.js';


const Form = function(vnode) {
  
  const model= vnode.attrs.model;
  const data= { type: 1 };

  const get_type= el=> el.options[ el.selectedIndex].value;
  model.href= taskReestr.invoice.get_url;
  
  const _submit = event=> doTask(event,
    moModel.formSubmit(event, _schema('task'), model, "POST")
  );
  
  return {
    view() {
      return m('div#task.pure-g', { style: "margin-bottom: 1.3em;" }, [
        m('.pure-u-1-3', [
          m('form.pure-form.pure-form-stacked',
            { onsubmit: _submit, oncreate: form_file_dom }, [
            m('fieldset', [
              m('legend', "Файл счета БАРС"),
              m('.pure-control-group', file_field(data) ),
              /*
              m('.pure-control-group', [
                m('label[for=month]', 'Месяц'),
                m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                  { value: data.month, onblur: e=> data.month = e.target.value }
                )
              ]),
              */
              m('.pure-control-group', [
                m('label[for=type]', 'Тип счета'),
                m('select.ml10[name=type]',
                  { onblur: e=> data.type= get_type(e.target) }, [
                  m('option[value=1][selected]', 'Амбулаторный'),
                  m('option[value=2]', 'Онкология'),
                  m('option[value=3]', 'Дневной стационар'),
                  m('option[value=4]', 'Профосмотр'),
                  m('option[value=5]', 'Инокраевые'),
                  m('option[value=6]', 'Тарифы ПМУ'),
                ]),
              ]),
              m('.pure-controls', [
                m('button.pure-button pure-button-primary[type="submit"]',
                  { style: 'margin-top: 0.5em'}, "Импорт")
              ])  
            ])
          ])
        ]),
        m('.pure-u-2-3',  taskResp(model) )
      ]);
    }
  };
}


export const vuInvimp = function (vnode) {
  
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(Form, { model: vnode.attrs.model } )
      ];
    }    
        
  }; 
}

