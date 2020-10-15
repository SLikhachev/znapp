// src/clinic/model/moCards.js

import { trims, just_int } from '../../apps/utils';
import { states, disp, memost } from '../../apps/appApi';
//import { vuDialog } from '../../apps/view/vuDialog.js';
import { changeValue, target } from '../../apps/model/moListItem';
import { 
  cleanEmpty,
  cleanForced,
  validator
 } from '../model/moModel.js';
//import { restSprav } from '../../sprav/spravApi.js';
//import { restClinic } from '../clinicApi.js';


//const _reg = _region();

//const Reg = _region();

export const _getFIO = row => {
  //console.log(row.fam, row.im);
  let f = ['fam', 'im', 'ot'].map(k => row[k] ? row[k] : '');
  return `${f[0]} ${f[1]} ${f[2]}`;
};

export const _ufms = e => {
  memost('dul_org');
  let ufms = just_int(e.target.value, 6);
  if (!!ufms)
    disp(['fetch_toForm', 'ufms', 'dul_org', 'name', 'dul_org']);
  return false;
};
//--------------------------

// CARD form VALIDATORS -----------

// Stream -> String
const crd_num = card => {
  let value = trims(card.crd_num);
  
  if (value === '')
    return 'Пустой номер карты';
  
  // questionable check 
  if(parseInt(value) === 0)
     return 'Недопустимый номер карты';
  
  if ( states().method === 'PATCH' && (value == states().card) )
    // same card number must be cleaned
    value = '';
  changeValue(target('crd_num', value));
  return '';
};
// ----------------------------

export const dost = card => {

  ['fam', 'im', 'ot'].map(
    k => card[k] ? changeValue(
      target(k, card[k].trim().toUpperCase()) 
    ) : void 0
  );

  let dost = '';
  if (!card.fam) dost += '2_';
  if (!card.im) dost += '3_';
  if (!card.ot) dost += '1_';
  if (!card.fam && !card().im)
    return 'Укажите Фамилию или Имя';
  if (!!dost)
    changeValue(target('dost', dost));
  return '';
};
//-----------------------------

const birth_date = card => {
  let d0 = new Date('1900-01-01');
  let d1 = new Date(Date.now());
  //d1= new Date( d1.getFullYear() - 18, 1, 1); // 18 years or older
  d1 = new Date(d1.getFullYear() - 3, 11, 31); // 3 years or older 
  let d = new Date(card.birth_date);
  if (d < d0 || d > d1)
    return 'Возраст пациента должен быть в диапазоне от 3 до 120 лет';
  return '';
};
//-------------------------------

const gender  = card => !!card.gender ? 
  '' : 'Не указан пол';
//-------------------------------

const dul_err = {
  dul_serial: 'Нет серии ДУЛ',
  dul_number: 'Нет номера ДУЛ',
  dul_date: 'Нет даты ДУЛ',
  dul_org: 'Кем выдан ДУЛ ?'
};

const dul = card => { 
  if (!card.dul_serial && !card.dul_number)
    changeValue(target('dul_type', null));
  
  if (card.polis_type && card.polis_type < 3 && !card.dul_type)
    return 'Для этого типа полиса заполните ДУЛ';
  
  if (card.dul_type)
    return Object.keys(dul_err).map(d=> card[d] ? '' : dul_err[d]);
  
  return '';
};
//-------------------------------------

const polis_type = card => card.polis_type ? 
  '' : 'Неизвестный тип полиса';
//-------------------------------------

const smo = card => (card.smo || card.smo_okato) ? 
  '' : 'Укажите либо СМО либо СМО ОКАТО';
//---------------------------------------

const city_g = card => (!card.city_g && card.street_g) ?
    'Укажите город': '';
//----------------------------------------

const ifEmpty = ['mo_att'];
const ignoreAny = ['ufms', 'created', 'modified', 'cuser' ];

const checkCard = [
  crd_num,
  dost,
  birth_date,
  gender,
  dul,
  polis_type,
  smo,
  city_g,
  //cleanEmpty(ifEmpty),
  cleanForced(ignoreAny)
];

const checkTalonCard = [
  dost,
  birth_date
];

export const cardValidator = validator(checkCard);

export const talonCardValidator = validator(checkTalonCard);

/*

export const moCardsList = {
  // return model object 
  getModel() {
    const model = {
      url: restClinic.card_find.url,
      method: restClinic.card_find.method,
      //headers: { 'Accept': 'application/json' },
      list: null, // main data list (showing in table page)
      error: null, // Promise all error
      order: true, // for list
      sort: null // for list
    };
    return model;
  },
  
  sort(model, id=null) {
    //console.log(id);
    let order = model.order ? 'desc' : 'asc';
    let field = id ? id : 'id'; 
    model.list = _.orderBy(model.list, [ field ], [ order ]);
    model.order = !model.order;
  },
  _table: 'cardz_clin',
  crdTable() {
    return `${moCardsList._table}`;
  },
};

const testCase = function(time, test) {
  return new Promise( (res, rej) => {
    setTimeout( () => {
      if (test) res("Test passed");
      else rej("Test not passed");
    }, time);
  });
}

export const cardOpt= {
  options: [restSprav.dul, restSprav.smo_local, restSprav.mo_local, restSprav.okato],
  data: new Map(),
  error: null,
  getOptions() {
    if (this.data && this.data.size && this.data.size !== 0) return;
    moModel.getData( cardOpt );
  }
}

export const moCard = {

  getModel() {
    const model= {
      url: [restClinic.get_card.url, restClinic.get_crd_talons.url],
      method: [restClinic.get_card.method, restClinic.get_crd_talons.method],
      map_keys: ['card', 'talons'],
      //map_data: new Map(),
      card: null,
      talons: null,
      error: null,
      save: null
    };
    return model;
  },
  
  getCard(model, crd) {
    let c= { _tbl: moCardsList.crdTable(), crd_num: String(crd) };
    let t= { tal_tbl: moTalonsList.talTable(), crd_num: String(crd) };
    //console.log(crd);
    return moModel.getViewRpcMap(
      model, [c, t]
    );
  },
  
  saveCard(event, card, model, method) {
    //event.preventDefault();
    event.target.parentNode.classList.add('disable');
    //let { crd_num } = model.card[0];
    //model.card = Object.assign(model.card, card);
    const to_save= Object.assign({}, card);
    //console.log(moCard.model.card);
    /*
    testCase(2000, true).then( (res) => {
      //console.log('ggg ', res);
      moCard.model.save = { ok: true,  msg: res};
      //console.log(moCard.model.save);
      event.target.parentNode.classList.remove('disable');
      m.redraw();
    }).catch( e => {
       moCard.model.save = { ok: false, msg: e };
       event.target.parentNode.classList.remove('disable');
        m.redraw();
    });
    *//*
    let schema = _schema('pg_rest');
    //let method = event.target.getAttribute('method');
    let { crd_num, id, old_card } = card;
    let table = `${schema}cardz_clin`;
    let url = id ? `${table}?id=eq.${id}`: table;
    ['id', 'created', 'modified', 'cuser', 'ufms'].forEach( k=> delete to_save[k] );
    if ( method === 'PATCH' && (crd_num == old_card) )
      // same card number 
      delete to_save.crd_num; // primary key duplication
    // else change card number
    delete to_save.old_card; // no that field in table
    //to_save.smo = parseInt(to_save.smo) + _reg;
    return m.request({
      url: url,
      method: method,
      body: to_save
    }).then( res => {
      //console.log(card.crd_num);
      event.target.parentNode.classList.remove('disable');
      return true;
    }).catch( err => {
      //model.save = errMsg(err);
      event.target.parentNode.classList.remove('disable');
      throw ( errMsg (err) );
      //vuDialog.open();
    });
  }
};
*/