
// src/sprav/view/dsTNM.js

import { vuLoading } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moModel.js';
import { fieldFrom } from '../../apps/form/foForm';
import { restSprav } from '../spravApi.js';

const Item = {
  name: { label: ['', 'Название группы'], input: {
      tag: ['.pure-u-3-4[size=64]', "text"],
    }
  },
};

const itf = function(f, d, a={}) { return fieldFrom(Item, f, d, a); };

// add PMU to GRUP
const grupForm = function (vnode) {

  let item; // = Object.assign({}, vnode.attrs.item);
  let fld= ['name',];
  let on_submit = function (event) {
    event.preventDefault();
    let model= Object.assign({ item: item}, restSprav.pmu_grup );
    moModel.formSubmit(event, model, 'PATCH');
    //moModel.getViewRpcMap(model, [ null, {code: item.code_usl}] );
  };
  
  return {

    view(vnode) {
      item= vnode.attrs.item;
      return m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit: on_submit },
            m("fieldset", m(".pure-g", [
              fld.map( f => m(".pure-u-1-3", itf(f, item))),
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
  let thdr= [['id', 'Код группы'], ['name', 'Описание'] ]
  let tr= it => m('tr', [thdr.map( k => m('td', it[ k[0] ]) ) ]); 
  
  return {
    view(){
      return [
        m('h2', 'Редактор групп ПМУ'),
        m('table.pure-table.pure-table-bordered', [
          m('thead', [thdr.map( t => m('th', t[1])) ]),
          m('tbody', tr(item))
        ]),
        m(grupForm, {item: item}),
      ];
    }
  };
}

const Pmuf = {
  /*
  ccode: { label: ['', 'Номер'], input: {
      tag: ['.input-find.pure-u-3-4', "number"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  */
  code_usl: { label: ['', 'Код ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4[size=20]', "text"],
      //attrs: { placeholder: 'Номер' }
    }
  },
}
const itg = function(f, d, a={}) { return fieldFrom(Pmuf, f, d, a); };

const grcForm = function (vnode) {
  
  let { model, item }= vnode.attrs;
  let _item= Object.assign({ code_usl: '' }, { grup: item.id });
  let _model= { url: restSprav.pgr.url, item: _item, change: ['code_usl', 'grup'] }
  let fld= ['code_usl'];
  let on_submit = function (event) {
    event.preventDefault();
    moModel.formSubmit(event, _model, 'POST');
    moModel.getViewRpcMap(model, [ null, {grup: item.id}] );
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


const vuPmus= function(vnode){
  
  let model= vnode.attrs.model;
  let item= vnode.attrs.model.item[0];
  let pmus;
  let ddel= e => {
    //e.preventDefault();
    let code_usl= e.target.getAttribute('data');
    let _model= {
      url: `${restSprav.pgr.url}?grup=eq.${item.id}`,
      key: 'code_usl',
      item: { code_usl },
    };
    moModel.formSubmit(e, _model, 'DELETE');
    moModel.getViewRpcMap(model, [ null, {grup: item.id}] );
    //m.redraw();
  };
  let thdr= [['code_usl', 'Код ПМУ'], ['name', 'Описание'],
    ['ccode', 'Номер'], [null, 'Удалить из группы'] ];
  let tr= row => m('tr', [thdr.map( k => {
    let td= k[0] ? row [ k[0] ] : m('i.fa.fa-minus-circle.choice.red',
      { data: row.code_usl, onclick: ddel });
    return m('td', td);
  }) ] ); 
  
  return {
    view(vnode){
      pmus= vnode.attrs.model.pmus;
      return [
        m('h3', 'В группу включены ПМУ'),
        m(grcForm, {model: model, item: item}),
        pmus ? 
        m('table.pure-table.pure-table-bordered', [
          m('thead', [thdr.map( t => m('th', t[1])) ]),
          m('tbody', [pmus.map(tr)] )
        ]) : '',
      ];
    }
  };
}


export const vuGrupItem = function(vnode){
  
  let { grup } = vnode.attrs; //from url
  let q= `?id=eq.${grup}`;
  //console.log(q);
  let model= moModel.getModel();
  model.url= [ `${restSprav.pmu_grup.url}${q}`, `${restSprav.grc.url}` ];
  model.method= ['GET', 'POST'];
  model.map_keys= ['item', 'pmus'];
  // getViewRpcMap(model: object, data: additional data object)
  moModel.getViewRpcMap(model, [ null, {grup: grup}] );
  
  return {  
    view() {
      return model.error ? [ m(".error", model.error) ] :
      model.item ?
        [m(vuItem, {model: model}), m(vuPmus, {model: model} )] 
      : m(vuLoading);
    }
  };
}