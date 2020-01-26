// ./reestr/view/vuVmxlimp.js
// import errors from VM xml file

import { vuLoading,  vuTheader, taskResp } from '../../apps/view/vuApp.js';
import { file_field, form_file_dom } from '../../apps/form/customFields.js';
import { _schema } from '../../apps/model/moModel.js';
import { moModel } from '../../apps/model/moFormModel.js';
import { doTask } from '../../apps/view/vuDataSheet';
import { restReestr } from '../reestrApi';

const Form = function(vnode) {
  
  const model= vnode.attrs.model;
  const data= {};
  const get_type= el=> el.options[ el.selectedIndex].value;
  
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
              m('legend', "Тип файла ошибок"),
              m('.pure-control-group', file_field(data) ),
              m('.pure-control-group', [
                m('label[for=type]', 'Тип протокола'),
                m('select.ml10[name=type]',
                  { onblur: e=> data.type= get_type(e.target) }, [
                  m('option[value=1][selected]', 'Амбулаторный'),
                  m('option[value=2]', 'Онкология')
                ]),
              ]),
              m('.pure-controls', [
                m('button.pure-button pure-button-primary[type="submit"]',
                  { style: 'margin-top: 0.5em'}, "Импорт")
              ])  
            ])
          ])
        ]),
        m('.pure-u-2-3', [ taskResp(model) ] )
      ]);
    }
  };
}


// clojure
export const vuVmxlimp = function (vnode) {
  let { header } = vnode.attrs;
  const _model = {
      url: `${restReestr.task.url}?task=eq.import_errors&select=pack_type(descr),file_name`,
      list: null
  };
  moModel.getList(_schema('pg_rest'), _model).then(() => {
    if (_model.list && _model.list[0]) {
      const item=  _model.list[0];
        if ( !! item.file_name )
           header = `${header} (последний файл: ${item.file_name} - ${item.pack_type.descr} )`
     }
  })

  return {
    view () {
      return _model.error ? [ m(".error", _model.error) ] : ! _model.list ?  m(vuLoading) :  [
        m(vuTheader, { header: header } ),
        m(Form, { model: vnode.attrs.model } )
      ];
    }    
        
  }; //return this object
}

