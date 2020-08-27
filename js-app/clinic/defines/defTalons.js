// src/sparv/defines/spravPmus.js
// prof sprav definition

import { states, memost } from '../../apps/appApi';
import { talons_table } from '../../apps/model/moList';
//import { $upper, linkItem, smoId } from '../../apps/defines/defStruct';
//import { spravLocal } from '../../sprav/defines/defLocal';
//import { spravComs } from '../../sprav/defines/defComs';
import { fetch_form, card } from '../form/foTalon';
import { _getFIO } from '../model/moCards';
import { $path } from './defClinic';


export const linkCard = (row, key, pk) => ([
  m(m.route.Link, { href: `${$path.cards}/${row[key]}` }, row[key]),
  '.choice.blue',
]);

const linkTalon = (row, key, pk) => ([
  m(m.route.Link, { href: `${$path.talons}/${row.crd_num}/${row[key]}` }, row[key]),
  '.choice.blue',
]);


const $talons = {
  // count talons in db table
  count: {
    rest: {
      url: 'rpc/get_tal_count', 
      method: "POST",
      params: talons_table(states, {'_tbl': ''})
    }
  },
  // fetch list of talons by fetch form params
  rest: {
    url: "rpc/talons_list",
    method: "POST",
    params: talons_table(states, {
      tbl: '',
      lim: 50,
      offs: 0
    }),
  },
  // form definition
  fetch: fetch_form,
  item: {
    header: "Поиск талонов по номеру талона, карты или дате",
    pk: 'tal_num',
    struct: {
      crd_num: ['Карта', '', linkCard],
      fam: ['ФИО', '', _getFIO],
      tal_num: ['Талон', '', linkTalon],
      open_date: ['Открыт'],
      close_date: ['Закрыт'],
      purp: ['Цель'],
      ds1: ['Диагноз'],
      spec: ['Спец'],
      code: ['Код'],
      family: ['Врач']
    }
  }
};


const talon = {
  rest: {
    url: "rpc/clin_card_by_num",
    method: "POST",
    params: {
      _tbl: 'cardz_clin'
    },
    data: ['card', 'talons'],
    options: ['mo_local', 'smo_local', 'dul', 'okato'],
    body: ['crd_num']
  },
  item: {
    header: "Талоны",
    validator: null,
    rest: { 
      url: 'cardz_clin',  
      headers: {Prefer: 'return=representation'} 
    }
  },
  mainForm: {
    //person,
    //insurance,
    //address
  }
};


export const clinicTalons = {

  page: "Клиника: Талоны",

  talons: $talons,
  //card,
  //card dependensies
  //smo_local: spravLocal.smo_local,
  //mo_local: spravLocal.mo_local,
  //dul: spravComs.dul,
  //okato: spravComs.okato,
  // talon representation
  card,
  talon
};


export const talons = {
  path: $path.talons,
  name: "Визиты",
  def: clinicTalons,
  add: '/add',
  //items: [],
  router: 'talons'
};