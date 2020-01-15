// src/clinic/view/vuTalonsTpl.js

import { vuLoading, vuTheader } from '../../apps/view/vuApp.js';
//import { vuDialog } from '../../apps/view/vuDialog.js';
import { moModel } from '../../apps/model/moModel.js';
import { restClinic, clinicApi } from '../clinicApi.js';
import { moTalonsList, talonOpt } from '../model/moTalons.js';
import { tabsView } from './vuTabs.js';
import { hdrMap } from './vuTalonsList';
import { talMain } from './vuTalon';
import { talDs } from './vuTalDs.js';

const hdr = {
    crd_num: ['Шаблон', 'link'],
    ist_fin: ['Ист. фин.'],
    doc_spec: ['Специальность'],
    doc_code: ['Код доктора'],
    purp: ['Цель'],
    rslt: ['Результат'],
    ishod: ['Исход лечения'],
    ksg: ['КСГ'],
    sh: ['Схема лечения']
};

const select= () => Object.keys(hdr).join(",");

const tplFind= function (vnode) {

  const { model } = vnode.attrs; 
  const href= [clinicApi.tal_tpl_add];
  
  const findTpl= function(event) {  
    event.preventDefault();
    const data = moModel.getFormData( event.target );
    const tpl= data.tpl_name ? data.tpl_name.replace(" ", "") : "";
    if ( !tpl )
      return false;
    const _model = {
      url:
      `${restClinic.talon_tpls_list.url}&crd_num=ilike.${tpl}&select=tal_num,${select()}&limit=50`,
      order_by: restClinic.talon_tpls_list.order_by
    };
    return moModel.getList(_model).then( (t)=>{
      if ( ! t || _model.list.length === 0 ) {
        //model.error = 'Нет таких шаблонов';
      } else {
        model.list = _model.list;
      }
    }).catch( ()=> model.error= _model.error );
  };
  
  return {
    view () {
    //console.log(vnode.attrs);
    return m(".pure-g", [
      m(".pure-u-18-24",
      // data gets from this FORM fieldsl
        m("form.pure-form[id=tpl_find]", { onsubmit: findTpl },
          m("fieldset",
            m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[name=tpl_name][type='text']",
                  {placeholder: "Имя шаблона", style: "font-size: 1.2em"}
                )
              ),
              m(".pure-u-1-3",
                m('button.pure-button[type="submit"]', { //onclick: findTpl,
                    style: "font-size: 1.2em"
                  }, "Найти" ),
                m(m.route.Link, { selector: 'a.pure-button.pure-button-primary',
                  href: href,
                  style: "margin-left: 2em; font-size: 1.2em"
                  }, "Новый шаблон" )
              ),
            ]) //pure-g
          ) //fieldset
        ) // form
      ), //pure-u-18-24
    ]); // pure-g
  } // view
}; // return
}; // tplFind

export const vuTalonsTplList = function (vnode) {
  
  const header = 'Список шаблонов талона';

  const model = {
        url: `${restClinic.talon_tpls_list.url}&select=tal_num,${select()}`,
        order_by: restClinic.talon_tpls_list.order_by
    };
  moModel.getList(model).then( (t)=>{
    //if ( ! t || model.list.length === 0 ) {
    //    model.error = 'Нет шаблонов';
    //}
  });

  const markDeleted= (e, name, num )=> {
    e.preventDefault();
    if (window.confirm(`Пометить шаблон ${name} на удаление?`)) {
      return moTalonsList.markDelete(e, num, 'PATCH', 'tpl').then( num=> {
        model.list= model.list.filter( t=> t.tal_num != num  );
      });
    }
    return false;
  };

  const listMap= function(s) {
    let id= s.tal_num, name= s.crd_num;
    return m('tr', [
      Object.keys(hdr).map( (column) => {
        let td = hdr[column].length < 2 ? m('td', s[column]) :
          m('td.choice.blue', m(m.route.Link,
              { href: `${clinicApi.talons_tpl}/${s.tal_num}` }, s[column])
          );
        return td;
      }),
      m('td', m('i.fa.fa-minus-circle.choice.red', {
        onclick: e=> markDeleted (e, s.crd_num, s.tal_num),
      }) )
    ]);
  };

  return {
    view () {
    return model.error ? [ m(".error", model.error) ] :
      model.list ? m('div', { style: "margin-left: 3em"}, [
        m(vuTheader, { header: header} ),
        m(tplFind, { model }),
          ! model.list[0] ? m('h1.blue', {style: "font-size: 1.5em;"}, "Нет шаблонов") :
          m('table.pure-table.pure-table-bordered[id=find_table]', [
            m('thead', hdrMap(hdr) ),
            m('tbody', [model.list.map( listMap )] )
          ])
      ]) : m(vuLoading);
    }
  };
}

export const vuTalonTpl = function(vnode) {

  const { tpl }= vnode.attrs;
  const model= Object.create({ tpl: 'tpl' }); //;
  
  const tabs= ['Талон', 'ДС', ];
  const conts= [talMain, talDs];
  model.word= 'Шаблоны';
  const t= Number(tpl);
  const method=  isNaN( t ) || t === 0 ? "POST" : "PATCH";
 
  if (method === "PATCH") { 
    const _model = {
      url: `${restClinic.talon_clin_tpl.url}${tpl}`,
      order_by: restClinic.talon_clin_tpl.order_by
    };
    moModel.getList(_model).then( (t)=>{
      if ( ! t || _model.list && _model.list.length === 0 ) {
        model.error = 'Нет таких шаблонов';
        //vuDialog.open();
      } else {
        model.talon = _model.list[0];
      }
    }).catch( ()=> { model.error= _model.error; }); //vuDialog.open(); } );
  } else {
    model.talon= Object.create({ });
  }
  
  return {
    view () {
      return model.error ? m(".error", model.error) :
        talonOpt.data.size === 0  ? m(vuLoading) : 
          m(tabsView, {model: model, tabs: tabs, conts: conts, method: method});
    }
  };
};
