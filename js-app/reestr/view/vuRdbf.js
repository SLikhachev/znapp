// ./reestr/view/vuRdbf.js
// import dbf reestrs files to sql tables for pavlenkov and stale files
import { vuTheader, doTask, taskResp } from '../../apps/view/vuApp.js';
import { file_field, form_file_dom } from '../../apps/form/customFields.js';
import { _month, _schema } from '../../apps/model/moModel.js';
import { moModel } from '../../apps/model/moFormModel.js';


const Form = function(vnode) {
  
  const model= vnode.attrs.model;
  const data= { month: _month() };
  //console.log(model);
  
  const _submit = event=> {
    //data.test= document.getElementById("test").checked ? 'test': '';
    return doTask(event,
      moModel.formSubmit(event, _schema('task'), model, "POST")
    ); };
  
  return {

  view() {
    //console.log(model);
    return m('.pure-g', [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', 
            { onsubmit: _submit, oncreate: form_file_dom }, [
          m('fieldset', [
            m('legend', "Импорт файлов реестров DBF"),
            m('.pure-control-group', file_field(data) ),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                 { value: data.month, onblur: e=> data.month = e.target.value }
              )
            ]),
            m('.pure-controls', [
              m('label.pure-checkbox[for="test"]', [ 
                m('input[id="test"][type="checkbox"][name="test"]',
                  { value: data.test, onblur: e=> data.test = e.target.value }
                ),
                m('span', { style: "padding: 0px 5px 3px;"}, "Тест")
              ])
            ]),
            m('.pure-controls', [
              m('button.pure-button pure-button-primary[type="submit"]',
                { style: 'margin-top: 0.5em'}, "Импорт")
            ])  
          ])
        ])
      ]),
      m('.pure-u-2-3', [ taskResp(model) ])
        
    ]);
  }
}
}

// clojure
export const vuRdbf = function (vnode) {
    
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(Form, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
}

