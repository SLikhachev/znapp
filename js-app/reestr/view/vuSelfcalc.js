// ./reestr/view/vuSelfcalc.js
//  calc sums for month  by type of records

import { _month, _schema } from '../../apps/model/moModel.js';
import { vuTheader, taskResp } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moFormModel.js';
import { doTask, get_type } from "../../apps/view/vuDataSheet";
import { taskReestr } from '../reestrApi.js';


const Form = function(vnode) {
  
  const model= vnode.attrs.model;
  const data= { month: _month(),  type: 1, smo: 'foms' };

  model.href= taskReestr.calc.get_url;
  
  const _submit = event=> doTask(event,
    moModel.formSubmit(event, _schema('task'), model, "POST")
  );
  
  return {
    view() {
      return m('div#task.pure-g', { style: "margin-bottom: 1.3em;" }, [
        m('.pure-u-1-3', [
          m('form.pure-form.pure-form-stacked',
            { onsubmit: _submit  }, [
            m('fieldset', [
              m('.pure-control-group', [
                m('label[for=month]', 'Месяц'),
                m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                  { value: data.month, onblur: e=> data.month = e.target.value }
                )
              ]),
              m('.pure-control-group', [
                m('label[for=smo]', 'СМО'),
                m('select.ml10[name=smo]',
                  { onblur: e=> data.smo= get_type(e.target) }, [
                  m('option[value=0][selected]', 'ФОМС'),
                  m('option[value=16]', 'СВ Прим'),
                  m('option[value=11]', 'ВС Альянс'),
                ]),
              ]),
              m('.pure-control-group', [
                m('label[for=type]', 'Тип рассчета'),
                m('select.ml10[name=type]',
                  { onblur: e=> data.type= get_type(e.target) }, [
                  m('option[value=1][selected]', 'Амбулаторный'),
                  //m('option[value=2]', 'Онкология'),
                  //m('option[value=3]', 'Дневной стационар'),
                  //m('option[value=4]', 'Профосмотр'),
                  //m('option[value=5]', 'Инокраевые'),
                  //m('option[value=6][selected]', 'ПМУ'),
                ]),
              ]),
              m('.pure-controls', [
                m('button.pure-button pure-button-primary[type="submit"]',
                  { style: 'margin-top: 0.5em'}, "Рассчитать")
              ])  
            ])
          ])
        ]),
        m('.pure-u-2-3',  taskResp(model) )
      ]);
    }
  };
}


export const vuSelfcalc = function (vnode) {
  
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(Form, { model: vnode.attrs.model } )
      ];
    }    
        
  }; 
}

