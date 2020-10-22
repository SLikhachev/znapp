
'use strict';

import { trims  } from '../../apps/utils';
import { states, disp } from '../../apps/appApi';
import { changedItem, changeValue, target } from '../../apps/model/moListItem';
import { _year, _mo } from '../../apps/model/moModel';
import { $scons } from '../defines/defClinic';
import {
  thisYear,
  _tupper,
  check_polis_type,
  check_smo,
  check_opts,
  item_attr,
  opt_find,
  opt_filter,
  cleanEmpty,
  cleanForced,
  zeroNum,
  validator
} from './moModel';
//----------------------------------

//talon editable
export const _editable = type => thisYear() && (type == 1);
  // talon_type: 
  // 0- deleted 1- open (may edit) 2- closed
  // talon of the same year may edit
  // case of 1. mek else we can not send it twice in same year

const tmonth = () => new Date().getMonth() + 1;

const _date = new Date().toISOString().slice(0,10);
//tal_num: null, crd_num: "",
//talon_type: 1, talon_month: 1,
//open_date: _d, close_date: _d,


// --------CARDS DATA for NEW TALON

const person_fileds = [
  'crd_num', 'fam', 'im', 'ot', 
  'birth_date', 'dost',
  'dul_serial', 'dul_number'
];

const smo_fields = [
  'polis_ser', 'polis_num', 
  'smo', 'smo_okato'
];

const _withTalon = t => { 
  if ( !t.talon_month ) 
    t.talon_month = tmonth();
  
  if (!t.tal_num) { // brand new
    t.first_vflag = 1; // new talon with first visit always
    t.talon_type = 1; // open/ready talon
    t.urgent= 0; // not urgent
    // initially set default smo, smo_okato from card
    //t.smo = data.crd_smo;
    //t.smo_okato = data.crd_smo_okato;
  }
  
  if( !!t.for_pom )
    t.urgent = t.for_pom == 2 ? 1: 0;
  return t;
};


const _withCard = card => smo_fields.
  reduce(
    (o, p) => R.assoc(`crd_${p}`, card[p], o),  
    [...person_fileds, ...smo_fields].
      reduce(
        (o, p) => R.assoc(p, card[p], o),  
        _withTalon({})
      )
);

export const initTalon = (talon, card={}) => 
  R.isEmpty(talon) ? 
    _withCard(card) :
    talon;

export const initTempl = () => _withTalon({});

/* Object -> Object // extract this fields from card object 
export const talonCard = card => newTalonCard(
  [
  'fam', 'im', 'ot', 'birth_date'
  ].reduce(
    (o, p) => R.assoc(p, card[p], o), 
    {}
  )
);
*/
//---------------------------------------

//------- TALON DATA for TALON

//-----------------------------

// _ -> Object // delete this fields from talon object 
// to save talon
export const toSaveTalon = () => [
  // from card form
  'id', 'fam', 'im', 'ot', 'birth_date', 'dost',
  'crd_polis_ser', 'crd_polis_num', 'crd_smo', 'crd_smo_okato',
  'dul_serial', 'dul_number',  'mo_att', 
  // from pmus form
  'code_usl', 'ccode', 'grup', 'method'
  ].reduce(
    (o, p) => R.dissoc(p, o),
    changedItem()
  );
//----------------------------------


// ------------ VALIDATE TALON funcs

const fin = s => opt_find('ist_fin', 'ist_fin', 'id').name || s;
const purp = s => opt_find('purpose', 'purp', 'id').name || s;
const doc = s => opt_filter('doctor', 'doc_spec', 'spec').find(
    d => d.code == changedItem().doc_code
  ) || s;

export const _doctor = () => {
  let _doc = doc('');
  if (!R.isEmpty(_doc))
    _doc = _doc.family;
 
  let _fin = `${fin('')} ${purp('')} ${_doc}`;
    
  return _doc ? _fin : 'red&Доктор ?';
};
//--------------------------------------

export const _naprav1 = () => {
  return check_opts(['mo_local', 'npr_mo', 'scode', item_attr('sname')]);
};

//--------------------------------------

const dsp = "^[A-Z][0-9]{2}$"; //(\.[0-9]{1,2})?$";
const diag = new RegExp( dsp );
//---------------------------------------

export const set_ds = e => {
  (e.target.value = _tupper(e.target.value));
  changeValue(e);
  //console.log(changedItem().ds1);
  let ds = e.target.name;
  if ( diag.test(changedItem()[ds]) )
    disp(['fetch_toOptions', 'mkb10', ds, ds]);
  return false;
};
//--------------------------------------

export const _memo_ds = d => {
  let [ds] = d, 
    ds_list = states().options.get(ds),
    resp = d == 'ds1' ? 'red&Диагноз ?' : '';
  //console.log('_memo_ds', ds, ds_list);
  if (ds_list) {
    let n = ds_list.find(o=>changedItem()[ds] == o.code.trim());
    resp = (n && n.name) ? n.name : resp; 
  }
  return resp;
};
//-----------------------------------------

// talon date
const talon_date = talon => {
  let d1= new Date(talon.open_date),
    d2= new Date(talon.close_date);
    return d1 > d2 ? 
      "Дата закрытия меньше даты открытия талона" :
      '';
};
//------------------------------------------

// forma pomoschi (urgent field is aux for for_pom only)
const for_pom = talon => (
  changeValue(target('for_pom', !!talon.urgent ? 2: 3)), 
  '');
//----------------------------------------

// Doct Oms
const fin_doc = () => [
  [ fin, "Укажите способ оплаты"], 
  [ purp, "Укажите цель"], 
  [ doc, "Укажите доктора"]
].map( el => el[0]('') ? '' : el[1]);
//---------------------------------------- 

export const _Num = n => Number(n) || 0;

const vizits = talon => {
 
  let amb = _Num(talon.visit_pol) + _Num(talon.visit_home), 
    ds = _Num(talon.visit_daystac) + _Num(talon.visit_homstac);
  
  if ( !( amb || ds ) )
    return "Укажите количество посещений";
  if ( amb && ds )
    return "Амбулвторный прием и ДСтац в одном талоне";
  if ( amb )
    changeValue(target('usl_ok', 3)); // ambul
  else
    changeValue(target('usl_ok', 2)); // day stac
  return '';    
};
//-------------------------------------------

const attached = tal => _mo().endsWith(tal.mo_att);

const naprav = talon => {
  let cons= talon.naprlech, hosp= talon.nsndhosp;
  // no napr
  // here $scons is Array(of int) as doc_spec who needs naprav to get the doc help   
  // here not specific from scons and not attached and not urgent and no napravl
  if ( 
    $scons.find( d => d == talon.doc_spec) && // this spec need as cons
    !attached(talon) && // not attached 
    !talon.urgent && // not urgent
    !cons ) // no naprav
    return `Укажите направление на консультацию специалиста ${talon.doc_spec}`;

  if ( !!cons && !!hosp )
    return "Госпитализация и Консультация в одном талоне";

  if (!cons && !hosp)
    return '';

  // opt_find (opt_key, form_field, item_key) => Object
  let [_mo, _spec] = cons ? ['npr_mo', 'npr_spec'] : ['hosp_mo', ''],
    mo = opt_find('mo_local', _mo, 'scode'),
    spec = _spec ? opt_find('doc_spec', _spec, 'spec') : _spec;

  if (R.isEmpty(mo))
    return "Неверный код МО направления ";
  
  if (!!_spec && R.isEmpty(spec))
    return  "Неверный код Специалиста направления";      

  //naprav date
  let ndate = new Date(talon.npr_date || '2040-01-01');
  if ( !!cons && (ndate > new Date(talon.open_date))) {
    changeValue(target('npr_date', talon.open_date));
    return '';    
  }      
  
  //hospital date
  if ( ndate > new Date(talon.close_date)) 
    changeValue(target('npr_date', talon.close_date));

  return '';  
};

const toZero= [
  'mek','visit_pol', 'pol_days', 'visit_home', 'home_days',
  'visit_homstac', 'visit_daystac', 'days_at_homstac', 'days_at_daystac',
  'npr_mo', 'npr_spec', 'hosp_mo',
  'extr', 'prof_k',
  'char1', 'char2', 
  'travma_type', 'patient_age',
];
const ifEmpty = [];
const ignoreAny = ['created', 'modified', 'cuser', 'urgent'];

const checkTalon = [
  talon_date,
  for_pom,
  fin_doc,
  check_polis_type,
  check_smo,
  naprav,
  vizits,
  cleanEmpty(ifEmpty),
  cleanForced(ignoreAny),
  zeroNum(toZero)
];
//-----------------------------------------

export const talonValidator = validator(checkTalon);

//-------TEMPLATE VALIDATOR------__---------

const tpl_name = talon => {
  let name = trims(talon.crd_num);
  if ( name.length < 4 )
    return "Имя шаблона не менее 4 символов без пробелов";
  changeValue(target('crd_num', name));
  return '';
};

const checkTalonTpl = [
  tpl_name,
  for_pom,
  fin_doc,
  cleanEmpty(ifEmpty),
  cleanForced(ignoreAny),
  zeroNum(toZero)
];

//-----------------------------------------

export const tplValidator = validator(checkTalonTpl);

//------------------------------------------
/*
export const moTalonsList = {
  // :: Object
  // return model object (POJO)
  getModel() {
    const model = {
      url: restClinic.talon_find.url,
      method: restClinic.talon_find.method,
      list: null, // main data list (showing in table page)
      error: null, // Promise all error
      order: true, // for list
      sort: null // for list
    };
    return model;
  },
  // in cards talons reads from actual table only
  // there is backdoor, you may set current local year to old date
  // then talons will be reads and writes to old table
  // talons reads from, 
  year: _month().split('-')[0], // on init app
  _year:  _month().split('-')[0], // on init app year,
  // only one table
  _table: 'talonz_clin_',
  _pmu: 'para_clin_',
  talTable(tpl='') {
    if (tpl === 'tpl') return'talonz_clin_tpl';
    return `${moTalonsList._table}${moTalonsList._year.slice(2)}`;
  },
  pmuTable() {
    return `${moTalonsList._pmu}${moTalonsList._year.slice(2)}`;
  },
  
  markDelete(event, num, method='PATCH', tpl='') {
    let pg_rest =  _schema('pg_rest');
    let table= moTalonsList.talTable(tpl);
    let url=`${pg_rest}${table}?tal_num=eq.${num}`;
    const body={};
    if ( method === 'PATCH')
      body.talon_type= 0;
    return m.request({
      url: url,
      method: method,
      body: body,
    }).then( () => {
      return num;
    }).catch( err => {
      //model.save = { err: true, msg: errMsg(err) };
      throw ( errMsg (err) );
    });
  },
  
};

export const talonOpt= {
  options: [ restSprav.doctor, restSprav.ist_fin, restSprav.smo_local, restSprav.okato,
    restSprav.purp, restSprav.chm, restSprav.cishod, restSprav.cresult, restSprav.travma,
    restClinic.get_talon_tpls
  ],
  data: new Map(),
  error: null,
  getOptions: async function() {
    if (this.data && this.data.size && this.data.size !== 0) return true;
    await moModel.getData( talonOpt );

  }
}

export const moTalon = {
  
  getModel() {
    const model= {
      // current polis included in talon
      url: [restClinic.get_talon.url, restClinic.get_pmu.url], //restClinic.get_polis.url],
      method: [restClinic.get_talon.method,  restClinic.get_pmu.method], //restClinic.get_polis.method],
      map_keys: ['talon', 'pmu', 'polis'],
      talon: null,
      card: null,
      pmu: null,
      polis: null,
      tosave: null,
      error: null,
      save: null,
      tpl: null
    };
    return model;
  },
  
  getTalon(model, card, talon) {
    let tal= parseInt(talon), crd = parseInt(card);
    if ( !isNaN(tal) && tal !== 0) {
      const t1= { tbl: moTalonsList.talTable(), _tal: tal };
      const t2= { tbl: moTalonsList.pmuTable(), _tal: tal };
      //const t3= { tyear: moTalonsList._year, _tal: tal };
      // exisiting talon? card will be fetched within talon record
      return moModel.getViewRpcMap(
        model, [ t1, t2 ]
      ).then( () => moTalon.prepare( model )  );//.catch(e => alert(e));
    }
    // get card only to new talon
    if ( isNaN(crd) || crd === 0) {
      model.error = 'Нужно выбрать карту';
      return false;
    }
    let pg_rest = _schema('pg_rest');
    let url = `${pg_rest}cardz_clin?crd_num=eq.${crd}`;
    return m.request({
      method: 'GET',
      url: url
    }).then(function(res) {
      // there are no talon and pmu keys
      model.card =  moTalon.set_polis( res ); // res is list
      model.pmu= [];
      moTalon.prepare( model ); 
    }).catch(function(err) {
      model.error = errMsg(err);
    });
  },
  
  set_polis( res ) {
    if (res.length === 0)
      throw 'Empty card for new talon';
    const card= Object.assign({}, res[0]);
    card.crd_polis_ser= card.polis_ser;
    card.crd_polis_num= card.polis_num;
    card.crd_smo= card.smo;
    card.crd_smo_okato= card.smo_okato;
    return [card];
  },
  
  // delete from talon cards fields
  to_talon(data, fields) {
    let t = {};
    Object.keys(data).map( k => {
      if (fields.indexOf(k) < 0) t[k] = data[k];
    });
    t.crd_num = data.crd_num;
    if ( !t.talon_month ) t.talon_month= tmonth();
    if (!t.tal_num) {
        t.first_vflag= 1; // new talon with first visit always
        t.talon_type= 1; // open/ready talon
        t.urgent= 0; // not urgent
        // initially set default smo, smo_okato from card
        t.smo = data.crd_smo;
        t.smo_okato = data.crd_smo_okato;
    }
    if( Boolean(t.for_pom) ) {
        t.urgent= t.for_pom == 2 ? 1: 0;
    }
    if (!data.ot) t.d_type= '5'; // d_type only one case here NET OTCHESYVA
    return t;
  },
  
  
  prepare( model ) {
   const card_fileds = [
    'id', 'crd_num', 'fam', 'im', 'ot', 'birth_date',
    'crd_polis_ser', 'crd_polis_num', 'crd_smo', 'crd_smo_okato',
    'dul_serial', 'dul_number',
    'mo_att' ];
    // prepare card
    let card = model.card ? model.card[0] : model.talon[0];
    let c = {};
    for (let f of card_fileds) {
      c[f] = card[f];
    }
    //c.smo -= _reg;
    //c.old_card= c.crd_num;
    model.card= c; // rewrites and this is not a list
    // prepare talon
    if ( Boolean(model.talon) && model.talon.length > 0)
      model.talon= moTalon.to_talon(model.talon[0], card_fileds);
    else
      model.talon= moTalon.to_talon( c, card_fileds );
  },
  
  saveTalon(event, model, method, tpl='') {
    //console.log(event);
    //if (tpl !== 'tpl')
    event.target.parentNode.classList.add('disable');
    const to_save= Object.assign({}, model.talon);
    const pg_rest =  _schema('pg_rest');
    //let tal_num;
    const { tal_num } = to_save;
    /*
    if (tpl === 'tpl')
      tal_num = to_save.tal_tpl;
    else
      tal_num = to_save.tal_num;
    *//*
    let table= moTalonsList.talTable(tpl);
    let url=`${pg_rest}${table}`;
    if ( Boolean(tal_num) ) {
      url += `?tal_num=eq.${tal_num}`;
      delete to_save.tal_num;
    }
    ['created', 'modified', 'cuser', 'urgent'].forEach( k=> delete to_save[k] );
    Object.keys(to_save).map( k=> {
      if ( to_save[k] === "" || to_save[k] === null ) {
        //console.log(k);
        delete to_save[k] //= null; // include 0 "" null
      }
    })
    return m.request({
      url: url,
      method: Boolean(tal_num) ? 'PATCH': 'POST',
      body: to_save,
      headers: {Prefer: 'return=representation'}
    }).then( res => {
      //if (tpl !== 'tpl')
      event.target.parentNode.classList.remove('disable');
      return res;
    }).catch( err => {
      //model.save = { err: true, msg: errMsg(err) };
      //if (tpl !== 'tpl')
      event.target.parentNode.classList.remove('disable');
      throw ( errMsg (err) );
    });
  },
  
};
*/