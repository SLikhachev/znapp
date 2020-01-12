// src/clinic/view/vuTalonsTpl.js

import { vuLoading } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moModel.js';
import { restClinic, clinicApi } from '../clinicApi.js';
import { moTalonsList,  } from '../model/moTalons.js';
import { hdrMap } from './vuTalonsList';

export const vuTalonsTplList = function (vnode) {

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
  const select= Object.keys(hdr).join(",");
  const model = {
        url: `${restClinic.talon_tpls_list.url}&select=tal_num,${select}`,
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
    //return m(tableView, {model: this.model , header: this.header }, [
    return model.error ? [ m(".error", model.error) ] :
      model.list ? [
        //m(vuTheader, { header: headerString} ),
        //m(talonFind, { model }),
          ! model.list[0] ? m('h1.blue', {style: "font-size: 1.5em;"}, "Нет шаблонов") :
          m('table.pure-table.pure-table-bordered[id=find_table]', [
            m('thead', hdrMap(hdr) ),
            m('tbody', [model.list.map( listMap )] )
          ])
      ] : m(vuLoading);
    }
  };
}

export const vuTalonTpl = function(vnode) {

  let { tpl }= vnode.attrs;
  let model= moTalon.getModel(); //;
  let tabs= ['Талон', 'ДС', ];
  let conts= [talMain, talDs];
  model.word= 'Шаблоны';
  let t= parseInt(tal);
  const method = isNaN(t) || t === 0 ? "POST": "PATCH";
  moTalon.getTalon(model, crd, tal );

  return {
    /*
    oninit () {
    },
    onbeforeupdate() {
    },
    */
    view () {
      return model.error ? [ m(".error", model.error) ] :
        talonOpt.data.size > 0 && model.card ?
          m(tabsView, {model: model, tabs: tabs, conts: conts, method: method})
          //ErrDialog(model)
        : m(vuLoading);
    }
  };
};
