

// src/clinic/model/moCards.js

'use strict';

import { trims, just_int } from '../../apps/utils';
import { states, disp, memost } from '../../apps/appApi';
import { changeValue, target } from '../../apps/model/moListItem';
import {
  check_polis_type,
  check_smo,
  //cleanEmpty,
  cleanForced,
  validator
} from '../model/moModel.js';


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
  if (parseInt(value) === 0)
    return 'Недопустимый номер карты';

  if (states().method === 'PATCH' && (value == states().card))
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

const gender = card => !!card.gender ?
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
    return Object.keys(dul_err).map(d => card[d] ? '' : dul_err[d]);

  return '';
};
//-------------------------------------

const city_g = card => (!card.city_g && card.street_g) ?
  'Укажите город' : '';
//----------------------------------------

//const ifEmpty = ['mo_att'];
const ignoreAny = ['ufms', 'created', 'modified', 'cuser'];

const checkCard = [
  crd_num,
  dost,
  birth_date,
  gender,
  dul,
  check_polis_type,
  check_smo,
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
