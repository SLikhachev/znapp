// src/report/view/vuHosp.js

import { _month, _schema } from '../../apps/model/moModel.js';
import { vuTheader } from '../../apps/view/vuApp.js';
import { taskReport } from '../reportApi.js';
import { moModel } from '../model/moModel.js';

const fileForm = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  const data= {
    month: _month(),
    _get: taskReport.hosp.get_url,
    _post: taskReport.hosp.post_url,
  };
  
  const on_form_submit = function (event) {
    event.preventDefault();
    return moModel.doSubmit(event.target, model, "POST");
  };
  
  const on_form_create = function (vnode) {
    let inputs = vnode.dom.querySelectorAll('.inputfile');
    Array.prototype.forEach.call( inputs, ( input ) => {
      let label	 = input.nextElementSibling, labelVal = label.innerHTML;
      input.addEventListener( 'change', ( e ) => {
        let fileName = '';
        if( this.files && this.files.length > 1 )
          fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
        else
          fileName = e.target.value.split( '\\' ).pop();
      
        if( fileName )
          label.querySelector( 'strong' ).innerHTML = fileName;
        else
          label.innerHTML = labelVal;
      });
    });
    vnode.dom.addEventListener('submit', on_form_submit);
  };
  
  const get_href = file=> `${_schema('task')}${data._get}${file}`;
  
  return {
  
    view() {
    //console.log(model);
    return m('.pure-g', [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', 
            { action: data._post,
              method: 'POST',
              oncreate: on_form_create
            }, [
          m('fieldset', [
            m('legend', "Отчет из файла ЕИР"),
            m('.pure-control-group', [
            m('input.inputfile[type="file"][name="file"][id="file"]',
              {'data-multiple-caption': "{count} files selected", 'multiple':false }
            ),
            m('label[for="file"]', m('strong', "Выбрать файл"))
            ]),
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
      m('.pure-u-2-3', [
        model.error ? m('.error', model.error) :
          model.message ? m('.legend', ["Статус обработки", 
            model.done ? m('div', [
              m('h4.blue', model.message),
              m('span.blue', {style: "font-size: 1.2em"}, "Файл отчета: "),
              m('a.pure-button', {href: get_href( model.file ), style: "font-size: 1.2 em"}, model.file ) 
           ]) : m('div', [
              m('h4.blue', model.message),
              m('span.blue', {style: "font-size: 1.2em"}, "Исходный файл: ", model.file )
           ])
          ]) : m('div')
        
      ])
    ]);
  }
}
}


export const vuHosp = function (vnode) {
  return {
    view () {
      return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(fileForm, { model: vnode.attrs.model } )
      ];
    }    
  }; 
}

