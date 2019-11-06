// src/clinic/view/vuTalon.js

import { vuDialog } from '../../apps/view/vuDialog.js';
import { vuLoading } from '../../apps/view/vuApp.js';
import { moModel } from '../../apps/model/moModel.js';
import { restSprav } from '../../sprav/spravApi.js';
import { clinicApi, restClinic } from '../clinicApi.js';
import { moTalonsList, moTalon, talonOpt } from '../model/moTalons.js';
import { tabsView, forTabs } from './vuTabs.js';
import { getName } from './vuCard.js';
import { tof } from '../form/foForm.js';
import { talCrd } from './vuTalCrd.js';
import { talNap } from './vuTalNap.js';
import { talPmu } from './vuTalPmu.js';
import { talDs } from './vuTalDs.js';
import { talPolis } from './vuTalPolis';
import { talNum, _notEdit } from './vuClinic'; //tal number

const num_fields= ['mek','visit_pol', 'pol_days', 'visit_home', 'home_days',
  'visit_homstac', 'visit_daystac', 'days_at_homstac', 'days_at_daystac',
  'npr_mo', 'npr_spec', 'hosp_mo', 'extr', 'prof_k',
  'char1', 'char2', 
  'travma_type', 'patient_age',
]

const toSaveTalon= async function (tal, check) {
  // mek and talon_type
  if ( Boolean( tal.mek ) )
    tal.tolon_type=1;
  
  tal.for_pom= Boolean(tal.urgent) ? 2: 3;

  // Doct Oms
  let e1= { fin: 'Укажите способ оплаты ', doct: 'Укажите доктора '};
  let r1= Object.keys(e1).map( p=> !check[p] ? e1[p] : '').join('');
  if ( Boolean(r1) )
    return r1;

  // polis talona
  if ( Boolean( tal.polis_num ))
    // SMO
    if ( !tal.smo && !tal.smo_okato)
      return 'Укажите либо СМО либо СМО ОКАТО';
    
  // ambul - stac days together
  let amb= Number(tal.visit_pol) + Number(tal.visit_home);
  let ds=  Number(tal.visit_daystac) + Number(tal.visit_homstac);
  //console.log( amb, ds);
  if ( Boolean(amb) && Boolean(ds) )
    return 'Амбулвторный прием и ДСтац в одном талоне';
  if ( Boolean( amb ) )
    tal.usl_ok= 3;
  else
    tal.usl_ok= 2;
    
  // napr ambul, stac together
  let cons= Boolean(tal.naprlech), hosp= Boolean(tal.nsndhosp);
  if ( cons && hosp ) 
    return 'Госпитализация и Консультация в одном талоне';
  
  // napr MO code
  // napr spec ambul
  
  let mo=0, spec=0;
  if (cons || hosp) {
    mo= cons ? Number(tal.npr_mo): Number(tal.hosp_mo);
    spec= cons ? Number(tal.npr_spec): 0;
    let _mo_url= `${restSprav.mo_local.url}?scode=eq.${mo}`;
    let _spec_url= `${restSprav.doc_spec.url}?spec=eq.${spec}`;
    let opt= [ { url: _mo_url } ];
    if ( cons ) {
        if (!tal.npr_date)
            tal.npr_date = tal.open_date;

        opt.push({url: _spec_url, order_by: 'spec'});
    //hospital
    } else {
        if (!tal.npr_date)
            tal.npr_date = tal.close_date;
    }
    let _mdl= { options: opt, data: new Map() };
    try {
      let r= '';
      let t= await moModel.getData(_mdl);
      //console.log(_mdl);
      if (_mdl.data.get(_mo_url).length === 0)
        r += 'Неверный код МО направления ';
      if (cons)
        if (_mdl.data.get(_spec_url).length === 0)
          r += 'Неверный код Специалиста направления';
      //console.log(r);
      if ( Boolean (r) )
        return r;
    } catch (e) {
      return e;
    }
  }
  num_fields.map(f=> {
    if (tal[f] === "") tal[f]= 0;
  });
  return '';

}

/*
const card_fileds = [
  'crd_num', 'fam', 'im', 'ot', 'date_birth',
  'polis_ser', 'polis_num', 'smo',
  'dul_serial', 'dul_number',
  'mo_att'
];
*/

//export const getName = function(data, val, key, prop, name, text, first_word=false) {
  // data - optional data MAP
  // val - string fofom input tag value
  // key - key in data MAP to check
  // prop - table's colemn name to check
  // name - name of table's column to output from
  // text - String text to output if item not find
  // first_word - out only first word from named column
const talForm = function (vnode) {
  
  let { model, method }= vnode.attrs;
  let tal= model.talon;
  //console.table(tal);
  const data= talonOpt.data;
  //console.log(data);
  
  const set_chk= (e, f)=> {
    tal[f]= e.target.checked ? 1: 0;
    //console.log(`${f}->${tal[f]}`);
    //console.log( e.target.checked, e.target.value );
    return false;
  };
  
  const check= {};
  const dsp= "^[A-Z][0-9]{2}(\.[0-9]{1,2})?$";
  const diag= new RegExp( dsp );
  const get_name=
    (val, key, prop, name, text, _word)=> getName( data, val, key, prop, name, text, _word );
  
  const doc_fam= ()=> {
    let doc;
    check.fin= data.get('ist_fin').find( f=> tal.ist_fin == f.id );
    let purp= get_name(tal.purp, 'purpose', 'id', 'name', 'Цель?', true);
    check.doct= data.get('doctor').find( d=> d.spec == tal.doc_spec && d.code == tal.doc_code );
    if ( Boolean(check.doct) && Boolean(check.doct.family) )
      doc= m('span', check.doct.family);
    else 
      doc= m('span.red', ' Доктор? ');
    
    return Array.of('', purp, doc);
  };
  // c_zab (1,2,3) if ds1 <> Z
  //ishod ()
  // rslt 
  const set_data= (e, attr, table, prop)=> {
    let ch;
    if (Boolean(e.target.value )) {
      ch = Array.from(data.get(table)).find(item => item[prop] == e.target.value.split('.')[0]);
      if (Boolean(ch)) {
        tal[attr]= ch[prop];
        e.target.value= ch[prop];
      } else {
        tal[attr]= e.target.value;
      }
    }
    return false;
  };
  
  const data_list= (list, table) => m(`datalist[id=${list}]`,
    data.get(table).map(c=> m('option', { value: `${c.id}. ${c.name.split(' ')[0]}`} ) ) );
  
  const set_istfin= e=> set_data(e, 'ist_fin', 'ist_fin', 'id');
  const set_char1= e=> set_data(e, 'char1', 'char_main', 'id');
  const set_char2= e=> set_data(e, 'char2', 'char_main', 'id');
  const set_ishod= e=> set_data(e, 'ishod', 'cishod', 'id');
  const set_result= e=> set_data(e, 'rslt', 'cresult', 'id');
  const set_travma= e=> set_data(e, 'travma_type', 'travma_type', 'id');
  
  //let ds1= tal.ds1, ds2= tal.ds2;
  const ds1_model= { mkb: 'mkb10?code=like.', order_by: 'code', list: null, headers: { Range: '0-20' } };
  const ds2_model= { mkb: 'mkb10?code=like.', order_by: 'code', list: null, headers: { Range: '0-20' } };
  //const ds_check= { url: 'mkb10?code=eq.', order_by: 'code', list: null };
  const set_ds= (ds, _model)=> e=> {
    tal[ds] = e.target.value;
    //console.log(e.target.value);
    if ( diag.test(tal[ds]) ) {
      _model.url = `${_model.mkb}${tal[ds]}*`;
      //console.log(ds);
      return moModel.getList(_model);// .then(t=> console.log( ds_model.list ));
    }
    //return true;
    return false;
  };
  const set_ds1= set_ds('ds1', ds1_model);
  const set_ds2= set_ds('ds2', ds2_model);
  
  const ds_show= tds=> {
    //console.log(tds);
    let dsl= ds1_model.list ? ds1_model.list: [];
    let ds= dsl.find(d=> tds == d.code.trim() );
    //console.log(ds);
    return ds ? ds.name: ''; // m('span.red', ' Диагноз? ');
  };

  const talonSave = async function(e) {
    e.preventDefault();
    model.save= await toSaveTalon(tal, check);
    //console.log( model.save );
    if ( Boolean( model.save ) ) {
      vuDialog.open();
      return false;
    }
    //console.log(tal);
    //return false;
    //model.save= null;
    return moTalon.saveTalon(e, model, method).then(res=>{
       let t= res[0]; //r= `${clinicApi.talons}/${t.tal_num}/${t.crd_num}`;
       tal= Object.assign(tal, t);
       m.route.set(clinicApi.talon_id, { tal: t.tal_num, crd: t.crd_num });
       //return true;
    }).catch(err=> {
      model.save = err;
      vuDialog.open();
    });
  }
  
  return {
    view() {
    //console.log('talForm view');
    return m(".pure-u-18-24", [
		m("form.pure-form.pure-form-stacked.tcard", { style: "font-size: 1.2em;",
      id: "talon", oncreate: forTabs, onsubmit: talonSave}, [
			m('fieldset', [ talNum(tal), 
        //
        m(".pure-g", [
          m(".pure-u-4-24", tof('open_date', tal)),
          m(".pure-u-4-24", tof('close_date', tal)),
          m('.pure-u-3-24', tof('talon_month', tal)),
          m('.pure-u-3-24', {style: "padding-top: 2em"},
            tof('mek', tal, { onclick: e=> set_chk(e, 'mek') }) ),
          m(".pure-u-6-24", {style: "padding-top: 2em"}, [
            tof('urgent', tal, { onclick: e=> set_chk(e, 'urgent') }),
            tof('first_vflag', tal, { onclick: e=> set_chk(e, 'first_vflag') }),
            
            //tof('finality', tal)
          ]),
        ]),
        //
        m(".pure-g", [
          m(".pure-u-2-24", [ tof('ist_fin', tal, { list: "istfin", onblur: set_istfin }),
            data_list('istfin', 'ist_fin')
          ]),
          m(".pure-u-2-24", tof('purp', tal)),
          m(".pure-u-2-24", tof('doc_spec',tal)),
          m(".pure-u-2-24", tof('doc_code', tal)),
          m(".pure-u-10-24", {
              style: "padding-top: 2em ; font-size: 1.1em; font-weight: 500"
            }, doc_fam() ),
        ]),
        //m('legend.leg-sec', "Визиты, дни"),
        m(".pure-g", [
          m('.pure-u-2-24', tof('visit_pol', tal)),
          m('.pure-u-2-24', tof('visit_home', tal)),
          m(".pure-u-6-24", {
            style: "padding-top: 2em ; font-size: 1.2em; font-weight: 600"
            },
            "Количество посещений"
          ),
        ]),
        //m('legend.leg-sec', "Диагноз, результат"),
        m('.pure-g', [
          m('.pure-u-3-24', [
            m('label', "Осн. диагноз"),
            m('input.input.pure-u-20-24[type=text][tabindex=13][required]', {
              list: 'ds1', value: tal.ds1, oninput: set_ds1
            }),
            m('datalist[id="ds1"]',
              ds1_model.list ? ds1_model.list.map(d=> m('option', {value: d.code.trim()})) : []
            )
          ]),
          m('.pure-u-3-24', [ tof('char1', tal, { list:  "char", onblur: set_char1 } ),
            m('datalist[id="char"]',
              data.get('char_main').filter(c => c.id < 4).map(c=>
                m('option', { value: `${c.id}. ${c.name.split(' ')[0]}` })
              )
            )
          ]),
          m('.pure-u-3-24', [ tof('ishod', tal, { list:  "ishod", onblur: set_ishod} ),
            data_list('ishod', 'cishod')
          ]),
          m('.pure-u-3-24', [ tof('rslt', tal, { list:  "result", onblur: set_result} ),
            data_list('result', 'cresult')
          ]),
          m(".pure-u-10-24", {
              style: "padding-top: 2em ; font-size: 1.1em; font-weight: 500"
            }, ds_show(tal.ds1)
          ),
        ]),
        m('.pure-g', [
          m('.pure-u-3-24', [
            m('label', "Доп. диагноз"),
            m('input.input.pure-u-20-24[type=text][tabindex=17]', {
              list: 'ds2', value: tal.ds2, oninput: set_ds2
            }),
            m('datalist[id="ds2"]',
              ds2_model.list ? ds2_model.list.map(d=> m('option', {value: d.code.trim()})) : []
            )
          ]),
          m('.pure-u-3-24', tof('char2', tal, { list:  "char", onblur: set_char2 } )),
          m('.pure-u-3-24', [ tof('travma_type', tal, { list:  "travma", onblur: set_travma }),
            data_list('travma', 'travma_type')
          ]),
        ]),

      ]),

      m('fieldset', { style: "padding-left: 0%;" }, [
				m('.pure-u-3-24', { style: "margin-top: 5px;" }, 
          m('button.pure-button.pure-button-primary[type="submit"]',
            { style: "font-size: 1.1em", disabled: _notEdit(tal)
              //onclick: talonSave
            },
          "Сохранить" )
        )
      ]) 
    ])//- form --
  ]); //- 18-24 -
 } // view
 }
};

const talMain = function (vnode) {
  let { model, method }= vnode.attrs;
  return {
    view () {
      //console.log('talMain view');
      return m(".pure-g", {style: "padding-left: 4em;"}, [
        m(talCrd, {model: model} ), // only patch
        m(talForm, {model: model, method: method } )
      ]);
    }
  }
};


export const vuTalon = function(vnode) {
  //console.log(vnode.attrs);
  
  let { tal, crd }= vnode.attrs;
  let model= moTalon.getModel(); //;
  let tabs= ['Талон', 'Направление', 'ДС', 'ПМУ', 'Полис на дату'];
  let conts= [talMain, talNap, talDs, talPmu, talPolis];
  model.word= 'Талоны';
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
        : m(vuLoading);
    } 
  }; 
};


