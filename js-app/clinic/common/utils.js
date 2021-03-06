
// src/clinic/view/vuClinic.js

import { disp, states } from '../../apps/appApi';
import { _region } from '../../apps/model/moModel';
import { changedItem, changeValue } from "../../apps/model/moListItem";

const Reg = _region();

export const _getFIO = row => {
  let f = ['fam', 'im', 'ot'].map(k => row[k] ? row[k] : '');
  return `${f[0]} ${f[1]} ${f[2]}`;
}

export const _just_int = (text, length = 0) => {
  if (typeof text !== 'string' || text.length < length)
    return NaN;
  return parseInt(text);
};

export const _ufms = e => {
  let ufms = _just_int(e.target.value, 6);
  if (!!ufms)
    disp(['fetch_rest', 'ufms', 'dul_org', 'Нет такого кода']);
  return false;
}

export const _polis_type = () => {
  let s = 0, n = 0;
  let type = changedItem().polis_type;
  const msg = (type, n) => ({
    3: "ЕНП 16 цифр",
    2: `Временное свидетельсто ${n} цифр`,
    1: `Старый полис ${n} цифр`,
    0: `red&Тип полиса неизвестен ${n} цифр`
  }[type]
  );

  if (!!changedItem().polis_ser)
    s = changedItem().polis_ser.toString().length;
  if (!!changedItem().polis_num)
    n = changedItem().polis_num.toString().length;
  //console.log(type)
  /*
  if (type)
    return disp(['memo', 'polis_type', type, msg(type, n)]);
  */
  if (s === 0 && n === 16)
    type = 3;
  else if (s === 0 && n > 0 && n < 16)
    type = 2;
  else if (s > 0 && n > 0)
    type = 1;
  else
    type = 0;

  return disp(['memo', 'polis_type', type, msg(type, n)])
};

const item_attr = attr => item => item[attr];


export const _dul_type = () => disp([
  'find_opts', 'dul', 'dul_type', 'code', item_attr('short_name')
])

export const _mo_att = () => disp([
  'find_opts', 'mo_local', 'scode', item_attr('sname')
])

// takes okato object -> vnode
export const _okato = o => m(`option[value=${o.okato}]`,
  `${o.region}. ${o.name.split(' ')[0]}`
)


export const _set_okato_by_smo = () => {
  // there had to be set SMO
  let smo = changedItem().smo;
  if (!smo)
    return false;
  let _smo = states().options.get('smo_local').find(item => item.code == smo);
  if (_smo)
    return disp(['memo', 'smo_okato', _smo.okato, _smo.okato]);
  return false;
};

export const _Num = num => num ? num : ''; //talon number

//talon editable
export const _notEdit = tal => {
  // 0- deleted 1- open (may edit) 2- closed
  //if (tal.talon_type === null || tal.talon_type === 1)
  // talon of the same year may edit
  // case of 1. mek else we can not send it twice in same year
  // same year may edit
  if ((moTalonsList.year == moTalonsList._year) && (tal.talon_type == 1))
    //console.log(tal.tal_num, tal.talon_type);
    return false; // may edit
  return true;
};

const _Name = name => name ? name : 'новый';
const tplName = (tal) => m('legend', `Шаблон ${_Name(tal.crd_num)}`);

export const talNum = function (tal, tpl = '') {
  return tpl ? tplName(tal) :
    m('legend', `Талон № ${_Num(tal.tal_num)}`,
      m('span', { style: "padding: 3em" }, _notEdit(tal) ? 'закрыт' : 'открыт'), `Год ${moTalonsList._year}`
    );
}

String.prototype.transLit = String.prototype.translit || function () {
  const rus = 'ЙЦУКЕНГШЩЗФЫВАПРОЛДЯЧСМИТЬ';
  const eng = 'QWERTYUIOPASDFGHJKLZXCVBNM';
  let i = rus.indexOf(this);
  if (i < 0) return this;
  return eng[i];
};

export const dupper = s => s.length > 0 ? s.charAt(0).toUpperCase().transLit() + s.substring(1) : s;
export const upper = s => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();

