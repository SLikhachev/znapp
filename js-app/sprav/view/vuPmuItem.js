
// src/sprav/view/dsTNM.js

import { vuLoading } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moModel.js';
import { fieldFrom } from '../../apps/form/foForm';
import { restSprav } from '../spravApi.js';

const Item = {
  ccode: { label: ['', 'Номер ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4', "number"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  code_podr: { label: ['', 'Подразделение'], input: {
      tag: ['.input-find.pure-u-3-4', 'number'],
      //attrs: { placeholder: 'Подразд' }
    }
  },
  code_spec: { label: ['', 'Специалист'], input: {
      tag: ['.input-find.pure-u-3-4', 'number'],
      //attrs: { placeholder: 'Спец' }
    }
  },
}
const itf = function(f, d, a={}) { return fieldFrom(Item, f, d, a); };

const pmuForm = function (vnode) {

  let item= Object.assign({}, vnode.attrs.item);
  let fld= ['ccode', 'code_podr', 'code_spec'];
  let on_submit = function (event) {
    event.preventDefault();
    let model= Object.assign({ item: item}, restSprav.pmu );
    return moModel.formSubmit(event, model, 'PATCH');
  };
  
  return {

    view() {

      return m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit: on_submit },
            m("fieldset", m(".pure-g", [
              fld.map( f => m(".pure-u-1-4", itf(f, item))),
              m(".pure-u-1-5", 
                m('button.pure-button.pure-button-primary[type="submit"]',
                  {style: 'margin-top: 1.7em'},
                  "Сохранить")
              )
            ]))
          ) //form
        ) // u-1-2
      ); // g return
    }// view
  }; //this object
}; //func


const vuItem= function(vnode){

  let item= vnode.attrs.model.item[0];
  //console.log(item);
  let thdr= [['code_usl', 'Код ПМУ'], ['name', 'Описание'] ]
  let fld = ['ccode', 'code_podr', 'code_spec'];
  
  let tr= it => m('tr', [thdr.map( k => m('td', it[ k[0] ]) ) ]); 
  
  return {
    view(){
      return [
        m('h2', 'Редактор ПМУ'),
        m('table.pure-table.pure-table-bordered', [
          m('thead', [thdr.map( t => m('th', t[1])) ]),
          m('tbody', tr(item))
        ]),
        m(pmuForm, {item: item}),
      ];
    }
  };
}

const Grit = {
  grup: { label: ['', 'Добавить к гуппе'], input: {
      tag: ['.input-find.pure-u-3-4', "number"],
      //attrs: { placeholder: 'Номер' }
    }
  },
}
const itg = function(f, d, a={}) { return fieldFrom(Grit, f, d, a); };

const grcForm = function (vnode) {
  
  let { model, item }= vnode.attrs;
  let _item= Object.assign({ grup: '' }, item);
  let _model= { url: restSprav.pgr.url, item: _item, change: ['code_usl', 'grup'] }
  let fld= ['grup', ];
  let on_submit = function (event) {
    event.preventDefault();
    return moModel.formSubmit(event, _model, 'POST').then( ()=> 
      moModel.getViewRpcMap(model, [ null, {code: item.code_usl}] ) );
    //console.log(model);
  };
  
  return {
    view() {
      return [ m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit: on_submit },
            m("fieldset", m(".pure-g", [
              fld.map( f => m(".pure-u-1-4", itg(f, _item) ) ),
              m(".pure-u-1-5", 
                m('button.pure-button.pure-button-primary[type="submit"]',
                  {style: 'margin-top: 1.7em'},
                  "Добавить")
              )
            ]))
          ) //form
        )), // u-1-2, g
        m('.pure-g', 
          m(".pure-u-1-2 ", 
            m('span#card_message',
              _model.save ? _model.save.ok ? _model.save.msg : m('span.red', _model.save.msg) : '')
          )
        )
      ]; // g return
    }// view
  }; //this object
}; //func


const vuGrups= function(vnode){
  
  let model= vnode.attrs.model;
  let item= vnode.attrs.model.item[0];
  let grup;
  //let grup= vnode.attrs.model.grup; //[0];
  //console.log(vnode.attrs.model.grup);
  let ddel= e => {
    //e.preventDefault();
    let grup= e.target.getAttribute('data');
    let _model= {
      url: `${restSprav.pgr.url}?code_usl=eq.${item.code_usl}`,
      key: 'grup',
      item: { grup: grup },
    };
    return moModel.formSubmit(e, _model, 'DELETE').then(()=>
      moModel.getViewRpcMap(model, [ null, {code: item.code_usl}] ) );
    //m.redraw();
  };
  let thdr= [['id', 'Номер группы'], ['name', 'Описание'], [null, 'Удалить из группы'] ];
  let tr= row => m('tr', [thdr.map( k => {
    let td= k[0] ? row [ k[0] ] : m('i.fa.fa-minus-circle.choice.red',
      { data: row.id, onclick: ddel });
    return m('td', td);
  }) ] ); 
  
  return {
    view(vnode){
      grup= vnode.attrs.model.grup;
      return [
        m('h3', 'ПМУ Включена в группы'),
        m(grcForm, {model: model, item: item}),
        grup ? 
        m('table.pure-table.pure-table-bordered', [
          m('thead', [thdr.map( t => m('th', t[1])) ]),
          m('tbody', [grup.map(tr)] )
        ]) : '',
      ];
    }
  };
}

export const vuPmuItem = function(vnode){
  
  let { code } = vnode.attrs; //from url
  //console.log(code);
  let q= `?code_usl=eq.${code}`;
  //console.log(q);
  let model= moModel.getModel();
  model.url= [ `${restSprav.pmu.url}${q}`, `${restSprav.pgc.url}` ];
  model.method= ['GET', 'POST'];
  model.map_keys= ['item', 'grup'];
  // getViewRpcMap(model: object, data: additional data object)
  moModel.getViewRpcMap(model, [ null, {code: code}] );
  
  return {  
    onupdate() {
      //moModel.getViewRpcMap(model, [ null, {code: code}] );
    },
    view() {
      return model.error ? [ m(".error", model.error) ] :
      model.item ?
        [m(vuItem, {model: model}), m(vuGrups, {model: model} )] 
      : m(vuLoading);
    }
  };
}