// src/apps/model/moModel.js

// this module is used by SPRAV CLINIC apps

'use strict';

export const errMsg = function (error) {
  if (!error)
    return 'Ошибка сервера (детали в журнале)';
  let e = error.response ? error.response : 'Ошибка сервера (пустой ответ)';
  let m = e.details ? e.details : e.message ? e.message : e;
  //let m= e.message ? e.message : error;
  console.log(m);
  return m;
};

// return date in yyyy-mm format
export const _month = () => {
  let d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
  m = m < 10 ? `0${m}` : `${m}`;
  return `${y}-${m}`;
};

export const _year = () => _month().split('-')[0]; // on init app year,

// return posgrest url if pg_rest else task url
export const _schema = type => {
  if (type === 'task')
    return window.localStorage.getItem('task_rest');
  return window.localStorage.getItem('pg_rest');
};

//export const _region= ()=> int(window.localStorage.getItem('smo_reg'));

export const _region = () => '25.';

export const _mo = () => window.localStorage.getItem('this_mo');

