// ./reestr/view/vuReestr.js
// make reestr zip

import { vuLoading, vuTheader, taskResp } from '../../apps/view/vuApp.js';
import { _mo, _month, _schema } from '../../apps/model/moModel.js';
import { moModel } from '../../apps/model/moFormModel.js';
import { doTask, get_fref, vuDataSheet } from "../../apps/view/vuDataSheet";
import { taskReestr, restReestr } from '../reestrApi';


const vuErrorsList = function (vnode) {

  const { header, struct, model } = vnode.attrs;
  const fref= get_fref();
  
  const listMap= s=> m('tr', [ Object.keys(struct).map(
    column=> m('td', fref( s, column ))
  ) ] );
  //vnode.attrs = {model.list, struct, header}
  const view = vuDataSheet( { attrs: { model: model, struct: struct, header: header  } } );
  return Object.assign( view, { listMap: listMap } );
}

const Form = function(vnode) {
  
  const {model, list_model, test }= vnode.attrs;
  //console.log(test);
  const data= { month: _month(), pack: 1};
  model.href= taskReestr.pack.get_url;
  
  const _submit = event=> {

    if ( ! Boolean(test) ) {
      console.log(_mo());
      if ( window.prompt(`Код для пакета № ${data.pack} за ${data.month}`) !== _mo() )
        return false;
    }
    data.check= test ? 'check': ''; //document.getElementById("check").checked ? 'check': '';
    data.sent= test ? '': document.getElementById("sent").checked ? 'sent': '';
    data.fresh= test ? '': document.getElementById("fresh").checked ? 'fresh': '';
    //console.log( data.check ); //return false;
    return doTask(event,
      moModel.doSubmit(event, _schema('task'), 'simple', model, data, "POST").then( done => {
        if ( !done )
          return moModel.getList( _schema('pg_rest'), list_model, restReestr.xml.params);
        return true;
      })
  ); };
  return {
    view() {
      return m('div.pure-g', { style: "margin-bottom: 1.3em;" }, [
        m('.pure-u-1-3', [
          m('form.pure-form.pure-form-stacked', { onsubmit: _submit }, [
            m('fieldset', [
              m('legend', "Параметры реестра"),
              m('.pure-control-group', [
                m('label[for=month]', 'Месяц'),
                m('input.fname[id="month"][type="month"][name="month"][reqired=required]',
                  { value: data.month, onblur: e=> data.month = e.target.value }
                )
              ]),
              test ? '' :
              m('.pure-control-group', [
                m('label[for=pack]', 'Номер пакета'),
                m('input.fname[id="pack"][type="number"][min=1][name="pack"]',
                  { value: data.pack, onblur: e=> data.pack = e.target.value }
                )
              ]),
              /*
              m(".pure-control-group", [
                m('label', {for: "check"}, "Ошибки"),
                m('span', {style: "line-height: 1em;"}, "Проверить"),
                m('input[name="check"][type="radio"]', {
                  style: "margin: 0 14px 0 7px;",
                  //value: 0,
                  //checked: data.check ? gnd(card) === 0 : false,
                  onchange: e => e.target.checked ? data.check = 'check' : data.check = 'ignore'
                }),
                m('span', "Игнорировать ошибки"),
                m('input[name="check"][type="radio"]', {
                  style: "margin: 0 0 0 7px;",
                  //value: 1,
                  //checked: card.gender ? gnd(card) === 1 : false,
                  onchange: e => e.target.checked ? data.check = 'ignore' : data.check = 'check'
                })
              ]),
              
              m('.pure-controls', [
                m('label.pure-checkbox[for="check"]', [ 
                  m('input[id="check"][type="checkbox"][name="check"]',
                    //{ value: data.check, onchange: e=> data.check = !e.target.value }
                  ),
                  m('span', { style: "padding: 0px 5px 3px;"}, "Только проверить")
                ])
              ]),
              */
              test ? '' :  m('.pure-controls', [
                m('label.pure-checkbox[for="sent"]', [ 
                  m('input[id="sent"][type="checkbox"][name="sent"]'
                    //{ value: data.sent, onblur: e=> data.sent = e.target.value }
                  ),
                  m('span', { style: "padding: 0px 5px 3px;"}, "Отметить отправленные")
                ]),
                m('label.pure-checkbox[for="fresh"]', [ 
                  m('input[id="fresh"][type="checkbox"][name="fresh"]'
                    //{ value: data.sent, onblur: e=> data.sent = e.target.value }
                  ),
                  m('span', { style: "padding: 0px 5px 3px;"}, "Не отправлять принятые")
                ])
              ]),
              
              m('.pure-controls', [
                m('button.pure-button pure-button-primary[type="submit"]',
                  { style: 'margin-top: 0.5em'}, test ? "Прверить" : "Сформировать")
              ])  
            ])
          ])
        ]),
        m('.pure-u-2-3', [ taskResp(model) ] )
      ]);
    }
  };
}

export const vuReestr = function (vnode) {
  const { model, struct, test } = vnode.attrs;
  let { header } = vnode.attrs;
  const list_model= {
    url: restReestr.xml.url,
    list: null ,
    error: null,
    quiet: true
  };
  const _model = {url: `${restReestr.task.url}?task=eq.make_xml`, list: test ? []: null};
  //console.log(_model);
  const err_header= 'Ошибки при формировании';
  if ( ! test ) {
     moModel.getList(_schema('pg_rest'), _model).then(() => {
       if (_model.list && _model.list[0]) {
         const file=  _model.list[0].file_name;
         if ( !!file )
           header = `${header} (последний пакет: ${file} )`
       }
   })
  }
  return {
    view () {
      return _model.error ? [ m(".error", _model.error) ] : ! _model.list ?  m(vuLoading) : [
        m(vuTheader, { header: header } ),
        m(Form, { model: model, list_model: list_model, test: test } ),
        m(vuErrorsList, { header: err_header, struct: struct, model: list_model } )
      ];
    }    
  };
}

export const vuPackTest = function(vnode) { return vuReestr(vnode); };