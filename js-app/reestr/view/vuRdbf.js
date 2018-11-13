// src/reestr/view/vuRdbf.js

import { vuTheader } from '../../apps/view/vuApp.js';
import { taskApi } from '../reestrApi.js';
import { task_rest, moModel } from '../model/moModel.js';

const fileForm = function(vnode) {
  
  const model = vnode.attrs.model;
  //console.log(model);
  
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

  return {

  oninit(vnode) {
    //vnode.state.task_get_url = restApi.hosp.get_url;
    vnode.state.task_post_url = taskApi.reestr_imp.post_url;
    /*
    vnode.state.ftype = [
      { id: 'rr', name: "Реестр", selected: true},
      { id: 'rp', name: "Параклиника", selected: false},
      { id: 'rs', name: "Стоматология", selected: false},
    ]
    */
    vnode.state.month = () => {
      let d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
        return `${y.toString()}-${m.toString()}`;
    }
  },
  
  view(vnode) {
    //console.log(model);
    return m('.pure-g', [
      m('.pure-u-1-3', [
        m('form.pure-form.pure-form-stacked', 
            { action: vnode.state.task_post_url,
              method: 'POST',
              oncreate: on_form_create
            }, [
          m('fieldset', [
            m('legend', "Импорт файлов реестров DBF"),
            m('.pure-control-group', [
            m('input.inputfile[type="file"][name="file"][id="file"]',
              {'data-multiple-caption': "{count} files selected", 'multiple':false }
            ),
            m('label[for="file"]', m('strong', "Выбрать файл"))
            ]),
            m('.pure-control-group', [
              m('label[for=month]', 'Месяц'),
              m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                { value: vnode.state.month() }
              )
            ]),
            /*
            m('.pure-control-group', [
              m('label[for=ftype]', 'Тип файла'),
              m('select[id=ftype][name=ftype]', [
                vnode.state.ftype.map( type => m('option', {
                  value: type.id,
                  selected: type.selected ? true : false
                }, type.name ) )
              ])
            ]),
            */
            m('.pure-controls', [
              m('label.pure-checkbox[for="test"]', [ 
                m('input[id="test"][type="checkbox"][name="test"]'),
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
      m('.pure-u-2-3', [
        model.error ? m('.error', model.error) :
          model.message ? m('.legend', ["Статус обработки", 
            m('div', [

              m('h4.blue', model.message),
              m('span.blue', {style: "font-size: 1.2em"}, "Исходный файл: ", model.file ),
              model.detail ? m('h4.red', model.detail) : '',

            ])
          ]) : m('div')
      ])
    ]);
  }
}
}


// clojure
const vuRdbf = function (vnode) {
    
  return {
  /*  
  oninit () {
  }
  /*
  oncreate() {
  },
  
  onupdate() {
  },
  */
  view (vnode) {
    
    return [
        m(vuTheader, { header: vnode.attrs.header } ),
        m(fileForm, { model: vnode.attrs.model } )
    ];
  }    
        
  }; //return this object
}

export { vuRdbf };

