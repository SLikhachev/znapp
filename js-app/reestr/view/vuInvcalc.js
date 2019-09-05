// src/report/view/vuInvexp.js

import { vuTheader, foResp } from '../../apps/view/vuApp.js';
import { _month, _schema } from '../../apps/model/moModel.js';
import { taskReestr } from '../reestrApi.js';
import { moModel } from '../model/moModel.js';


const Form = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  const data= {  month: _month(), typ: 1 };
  //const schema= _schema('task');  
  const get_type= el=> el.options[ el.selectedIndex].value;
  model.href= taskReestr.calc.get_url;
  const on_submit= event=> {
    //console.log('report');
    event.preventDefault();
    let imp= document.getElementById('imp');
    imp.classList.add('disable');
    //console.log(resp.getAttribute('display'));
    moModel.formSubmit(event, _schema('task'), model, "POST").then((t) => {
      //console.log(model);
      imp.classList.remove('disable');
    });
  };
  
  return {
  
    view() {
      //console.log(model);
      return m('div#imp.pure-g', { style: "margin-bottom: 1.3em;" }, [
        m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', {onsubmit: on_submit},
          m('fieldset', [
            m('legend', "Сформировать XLSX файл"),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                { value: data.month, onblur: e=> data.month = e.target.value }
              )
            ]),
            m('.pure-control-group', [
              m('label[for=typ]', 'Тип реестра'),
              m('select.ml10[name=typ]',
                { onblur: e=> data.typ= get_type(e.target) }, [
                m('option[value=1][selected]', 'Амбулаторный'),
                m('option[value=2]', 'Онкология'),
                m('option[value=3]', 'Дневной стационар'),
                m('option[value=4]', 'Профосмотр'),
                m('option[value=5]', 'МТР ТФОМС'),
                m('option[value=6]', 'Тарифы ПМУ'),
              ]),
            ]),
            m('.pure-control-group', [
              m('label[for=smo]', 'Страховщик'),
              m('select.ml10[name=smo]',
                { onblur: e=> data.smo= get_type(e.target) }, [
                m('option[value=11][selected]', 'ВСА'),
                m('option[value=16]', 'СВ Приморье'),
                m('option[value=0]', 'ТФОМС'),
              ]),
            ]),
            m('.pure-controls', [
              m('button.pure-button.pure-button-primary[type="submit"]',
                { style: "font-size: 1.2em; margin-top: 1em;",
                  //onclick: upload
                }, "Сформировать")
            ])
          ])
        )
      ]),
      m('.pure-u-2-3', foResp(model) )
    ]);
  }
};  
}

export const vuInvcalc = function (vnode) {
  //card_id: "/cards/:crd",
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(Form, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
}

