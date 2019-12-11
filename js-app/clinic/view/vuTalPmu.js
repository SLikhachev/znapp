
import { moModel } from '../../apps/model/moModel.js';
import { restSprav } from '../../sprav/spravApi';
import { restClinic } from '../clinicApi.js';
import { moTalonsList, talonOpt } from '../model/moTalons.js';
import { ptf } from '../form/foForm.js';
import { _Num, _notEdit, dupper } from './vuClinic'; //tal number

const _disabled= tal=> { return _notEdit(tal) || !Boolean( _Num(tal.tal_num) ); };

const pmuForm = function (vnode) {
  
  let { talon, pmu }= vnode.attrs.model;
  // form fields
  const fld= ['code_usl', 'ccode', 'grup'];
  const set_code= e=> _pmu.code_usl = dupper(e.target.value);

    // local form pmu obj
  const _pmu= {}, data= talonOpt.data;
  // local model obj
  const md= { url: moTalonsList.pmuTable(), method: 'POST' };
  
  const get_doc= spec=> {
    // if talon to this doctor spec then this doctor code
    if ( !!talon.doc_spec && !!talon.doc_code) { 
      if ( talon.doc_spec == spec)
        return talon.doc_code;
      
      // else first doc with this spec from all doctors
      let doc= Array.from(data.get('doctor')).find( d=> d.spec == spec);
      if ( Boolean(doc) )
        return doc.code;
      return 0; // error
    }
    return 0; // error
  };
  
  const preparePara= item=> {
    //INPUT
    // item -> code_usl, name, code_podr, code_spec
    // OUTPUT
    // para -> tal_num, date_usl, code_usl, kol_usl, exec_spec, exec_doc, exec_podr
    let exec_spec= parseInt( item.code_spec );
    
    if ( isNaN( exec_spec ) || exec_spec === 0)
      return { error: `Неверный код специалиста ПМУ ${item.code_usl}`}; //error 
    
    let exec_podr= item.code_podr ? item.code_podr : 281;
    
    let exec_doc= get_doc(exec_spec);
    if ( ! Boolean( exec_doc ))
      return { error: `В МО нет доктора по специальности: ${exec_spec}`}; //error   
    
    return {
      tal_num: talon.tal_num, date_usl: talon.open_date,
      code_usl: item.code_usl, kol_usl: 1, exec_podr: exec_podr,
      exec_spec: exec_spec, exec_doc: exec_doc, error: ''
    };
  };
  
  const on_submit = event=> {
    event.preventDefault();
    _pmu.error = _pmu.list = null;
    
    let q= fld.filter( f=> Boolean( _pmu[f] )); // field name
    //console.log(q);
    if ( q.length === 0 )
      return false;
    else
      q= q[0]; // first finded
    
    let errors={};
    // select by group
    if ( q == 'grup' ) {
      _pmu.url= restSprav.grc.url;
      _pmu.method= 'POST'
      return moModel.getViewRpc(_pmu, { grup: _pmu[q] } ).then(()=> {
        if (_pmu.list.length === 0)
          return Promise.reject('Нет такой группы');
       
        let items= [];
        for ( let it of _pmu.list.values() ){
          let item= preparePara(it);
          if ( item.error ) {
            errors[item.error]= errors[item.error] ? errors[item.error] + 1 :  1; 
            continue;
          }
          delete item.error;
          items.push(item);
        }
        if (items.length === 0) return Promise.reject('Плохая группа ');
        // bulk insert to table
        md.headers= {Prefer: 'return=representation'};
        return moModel.getViewRpc(md, items);
      }).then(()=> {
        if ( ! Boolean(md.list) ) return Promise.reject('Empty response after PMU GRUP POST ');
        //let list= Arroy.from(md.list);
        for (let [idx, it] of md.list.entries() ){
          it.name= _pmu.list[idx].name;
          it.ccode= _pmu.list[idx].ccode;
          //console.log(it);
          pmu.push( it );
        }
      }).catch( err=> {
         _pmu.error= err;
         Object.keys(errors).map( e=> {
           _pmu.error= _pmu.error + ` ${e}: ${errors[e]}`; 
         });
      });
    }
    
    _pmu.url= `${restSprav.pmu.url}?${q}=eq.${_pmu[q]}`;
    
    return moModel.getList( _pmu ).then( ()=>{
      // anyway returns Promise
      if (_pmu.list.length === 0) return Promise.reject('Нет таких ПМУ');
      md.item= preparePara( _pmu.list[0] );
      if ( md.item.error ) return Promise.reject(md.item.error);
      // promise
      // reutrn inserted object      
      md.headers= {Prefer: 'return=representation'};
      // promise
      return moModel.formSubmit(event, md, 'POST');
    // add this item to model.pmu
    }).then( res=>{
      if (res.length && res.length > 0) {
        //console.log(res);
        res[0].name= _pmu.list[0].name;
        res[0].ccode= _pmu.list[0].ccode;
        pmu.push( res[0] );
        //pmu= [...pmu, res[0] ];
        //console.log(pmu);
        //return true;
      } else
        return Promise.reject('Empty response after PMU ITEM POST ');
    }).catch( err => {
    // process error
      _pmu.error= err;
    });
  
  };
  return {
    view() {
      return [ m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form", { onsubmit: on_submit },
            m("fieldset", m(".pure-g", [
              m(".pure-u-1-4", [
                m('label', "Код ПМУ"),
                m('input.input-find.input.pure-u-3-4[type=text]', {
                  value: _pmu.code_usl, oninput: set_code
                }),
              ]),
              ['ccode', 'grup'].map( f => m(".pure-u-1-4", ptf(f, _pmu) ) ),
              m(".pure-u-1-5", 
                m('button.pure-button.pure-button-primary[type="submit"]',
                  {style: 'margin-top: 1.7em', disabled: _disabled(talon) },
                  "Добавить")
              )
            ]))
          ) //form
        )), // u-1-2, g
        m('.pure-g', 
          m(".pure-u-1-2 ", 
            m('span#card_message', _pmu.error ? m('span.red', _pmu.error) : '')
          )
        )
      ];
    }// view
  }; //this object
}; //func


export const talPmu = function(vnode) {
  
  let model= vnode.attrs.model;
  let tal= model.talon;
  let pmu = model.pmu ? model.pmu: [];
  let para_table= moTalonsList.pmuTable();
  //tal_num int, date_usl date, code_usl varchar, kol_usl smallint,
  //exec_spec int, exec_doc int, exec_podr int, name varchar

  let pmu_hdr = {
      ccode: ['Номер'],
      code_usl: ['Код услуги'],
      kol_usl: ['Кол-во'],
      name: ['Наименование'],
      exec_spec: ['Спец'],
      exec_doc: ['Спец код'],
      exec_podr: ['Подр'],
      tarif: ['Тариф 5/2']
  };
  
  const caption= ()=>{
    if ( _notEdit(tal) )
      return 'Закрытые талоны не редактируем';
    if ( ! Boolean( _Num(tal.tal_num) ) )
      return 'Талон без номера, сначала сохраните новый талон';
    return 'ПМУ текущего талона';
  };
  
  const kol_usl= e=> {
    let id= e.target.getAttribute('data');
    let p= pmu.find( el => el.id == id );
    let url= `${para_table}?id=eq.${id}`;
    return { p, url };
  };
  
  const add_kol_usl= e=> {
    let { p, url } = kol_usl(e);
    let md= {};
    return moModel.getViewRpc( md, { kol_usl: p.kol_usl+1 }, url, 'PATCH' ).then( t=> {
       p.kol_usl += 1;
       return true;
    });
    //return false;    
  };
  const del_kol_usl= e=> {
    let { p, url } = kol_usl(e);
    let md= {};
    if (p.kol_usl == 1) {
      return moModel.getViewRpc( md, {}, url, 'DELETE' ).then( t => {
        //pmu= pmu.filter( el=> el.id != p.id );
        p.kol_usl=0;
        return true;
      });
    } else {
      return moModel.getViewRpc( md, { kol_usl: p.kol_usl-1 }, url, 'PATCH' ).then( t=> {
         p.kol_usl -= 1;
         return true;
      });
    }
    return false;    
  };
  
  let hdrMap= function(){
    return m('tr', [
      Object.keys(pmu_hdr).map( column => m('th', pmu_hdr[column][0])),
      m('th', "Добавить"),
      m('th', "Удалить"),
    ]);
  };
  //return s.kol_usl > 0 ? m('tr', { key: s.id }, [
  const listMap= function (s) {
      return s.kol_usl > 0 ? m('tr', [
        Object.keys(pmu_hdr).map( (column) => m('td', s[column])),
        m('td', m('i.fa.fa-plus-circle.choice', {
          style: "color: green;",
          data: s.id,
          onclick: _disabled(tal) ? null: add_kol_usl
        }) ),
        m('td', m('i.fa.fa-minus-circle.choice.red', {
          data: s.id,
          onclick: _disabled(tal) ? null: del_kol_usl
        }) )
      ]) : '';
  };
  
  return {
    view() {
       //console.log('talPara view');
      return [
        m(pmuForm, { model }),
        m('table.pure-table.pure-table-bordered', [
          m('caption', { style: "font-size: 1.2em; font-weight: 600" }, caption()),
          m('thead', hdrMap()),
          m('tbody', [pmu.map( listMap )] )
        ])
      ];
    }
  };
}
