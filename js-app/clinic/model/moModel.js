
'use strict';

import { states, disp } from '../../apps/appApi';
import { checkArray } from '../../apps/model/moModel';
import { changedItem, changeValue, target } from '../../apps/model/moListItem';
import { _year } from '../../apps/model/moModel';


export const _check = a=> checkArray(a) ? a[0]: 'нет значения';


String.prototype.transLit = String.prototype.translit || function () {
  const rus = 'ЙЦУКЕНГШЩЗФЫВАПРОЛДЯЧСМИТЬ';
  const eng = 'QWERTYUIOPASDFGHJKLZXCVBNM';
  let i = rus.indexOf(this);
  if (i < 0) return this;
  return eng[i];
};

export const _tupper = s => s.length ? s.charAt(0).toUpperCase().transLit() + s.substring(1) : s;
export const _supper = s => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();


export const thisYear = () => _year() == states().year;


export const item_attr = attr => item => item[attr];

//params: ['dul_org', 'ufms', 'code', item_attr('name')]
// Array -> String
export const check_opts = params => { 
  let [data, field, find, fn] = params;
  // data - String -> key in data MAP to get
  // field - String form field name cantains the value to find
  // find - String -> prop in data array item to find
  // fn - output with find item
  fn = typeof fn === 'function' ? fn : x=>x;
  let value = changedItem()[field], opts = states().options;
  let notfind = `red&Нет элемента ${find}-${value} в списке ${data}`;

  //console.log('find_opt', data, field, find, value);
  if (!value || !opts)
    return ''; 
  
  let list = opts.get(data) || null;
  
  if (R.isNil(list))
    return null;

  if (list[0] && list[0].error) // after disp fetch error 
      return list[0].error;
  
  let item = list.find(it => it[find].toString() == value);
  if (item !== undefined)
      return fn(item);

  return notfind;
};

const change = (name, value) => changeValue( { target: { name, value }} );

const _ptype = type => ({
    3: "ЕНП 16 цифр",
    2: `Временное свидетельсто 9 цифр`,
    1: `Старый полис`,
    0: `red&Тип полиса неизвестен`
  }[type]
);

export const polis_type = () => _ptype( changedItem().polis_type );

const calc_type = () => {
  let s = 0, n = 0 ;
  if (!!changedItem().polis_ser)
    s = changedItem().polis_ser.toString().length;
  if (!!changedItem().polis_num)
    n = changedItem().polis_num.toString().length;
  
  if (s === 0 && n === 16)
    return 3;
  
  //if (s === 0 && n > 0 && n < 16)
  if (s === 0 && n === 9)
    return 2;
  
  if (s > 0 && n > 0)
    return 1;
  
  return 0;
};


export const set_polis_type = () => change('polis_type', calc_type());


export const set_okato_by_smo = () => {
  // there had to be set SMO
  let smo = changedItem().smo;
  //console.log('smo ok ', smo )
  if (!smo)
    return false;
  let _smo = states().options.get('smo_local').find(item => item.code == smo);
  if (_smo) {
    //console.log(_smo.okato);
    change('smo_okato', _smo.okato);
  }
  return false;
};

// takes okato object -> vnode
export const _okato = o => m(`option[value=${o.okato}]`,
  `${o.region}. ${o.name.split(' ')[0]}`
);


export const check_dul = () => {
  let ser = changedItem().dul_serial  || '',
    num = changedItem().dul_number || '', 
    dul = ser || num ? `${ser} ${num}` : "Нет";
  return `Документ: ${dul}`;
};


export const check_att = () => {
  let att = changedItem().mo_att || "Нет";
  return `Прикреплен: ${att}`;
};

export const opt_key_value = (key, value) => o => m(
  `option[value=${o[key].toString().trim()}]`, 
  `${o[value].toString().trim()}`
);

export const id_name = opt_key_value('id', 'name');

// if not options what then ?
export const opt_find = 
  (opt_key, form_field, item_key) => (
    states().options && states().options.get(opt_key) &&
    states().options.get(opt_key).
      find(o=>changedItem()[form_field] == o[item_key]) ||
    {});

export const opt_filter = 
  (opt_key, form_field, item_key) => (
    states().options && states().options.get(opt_key) &&
    states().options.get(opt_key).
      filter(o=>changedItem()[form_field] == o[item_key]) ||
    []);
//-----------------------------------------------

// fill with value
const fillFields = value => list => item => list.reduce(
  (r, k) => !item()[k] ? // null, undef, '', 0
    (changeValue(target(k, value)), '') :
    '',
  ''  
);
//--------------------------------------

// fill with '' 
export const cleanEmpty = fillFields('');
//-----------------------------------------------

// fill with zer0
export const zeroNum = fillFields(0);
//------------------------------------------------

// clean values forced
export const cleanForced = list => item=> list.reduce(
  (r, k) => (changeValue(target(k, '')), ''), 
  ''
);
//------------------------------------------------

// (Array[Function] -> Stream) -> Array[String]
export const validator = checks => item => R.flatten(
  // checks:  Array[Function],
  checks.map( f => f(item)) ).filter(e => !!e);
