

// src/clinic/defines/defTalons.js

'use strict';

import { states } from '../../apps/appApi';
import { _mo } from '../../apps/model/moModel';
import { talons_table } from '../model/moModel';
//import { $upper, linkItem, smoId } from '../../apps/defines/defStruct';
import { spravLocal } from '../../sprav/defines/defLocal';
import { spravProf } from '../../sprav/defines/defProf';
import { spravComs } from '../../sprav/defines/defComs';
import { spravPmus } from '../../sprav/defines/defPmus';
import {
  fetch_form,
  $card,
  talDate,
  talTarget,
  talVizits,
  talDs1,
  talDs2
} from '../form/foTalon';
import { naprForm } from '../form/foTalonNaprav';
import { polisForm } from '../form/foTalonPolis';
import { dstacForm } from '../form/foTalonDstac';
import { tal_pmu, pmu, pmu_grup } from '../form/foTalonPmu';
import { _getFIO } from '../model/moCards';
import { talonValidator } from '../model/moTalons';
import { $path, mkb10 } from './defClinic';
import { talonTempls } from './defTempls';


export const talonPath = (card, talon) => `${$path.talons}/${card}/${talon}`;

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
      params: talons_table(states, { '_tbl': '' })
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
    url: "rpc/get_talon_by_num",
    method: "POST",
    params: talons_table(states, { tbl: '' }),
    data: ['talon', 'tal_pmu'],
    //options_cards: ['mo_local', 'smo_local', 'dul', 'okato'],
    options: [
      'mo_local', 'smo_local', 'okato',
      'ist_fin', 'purpose', 'doctor', 'doc_spec',
      'char_main', 'cishod', 'cresult', 'travma_type',
      'templs'
    ],
    body: ['_tal']
  },
  item: {
    header: "Талоны",
    validator: talonValidator,
    rest: talons_table(states, {
      url: '',
      headers: { Prefer: 'return=representation' }
    }),
    item: { pk: 'tal_num' },
    confirm: _mo
  },
  mainForm: {
    talDate,
    talTarget,
    talVizits,
    talDs1,
    talDs2
  },
  naprForm,
  polisForm,
  dstacForm
};


export const clinicTalons = {

  page: "Клиника: Талоны",
  name: 'Talons',

  talons: $talons,

  //talon dependensies
  //options: [ 'ist_fin', 'purp', 'doctor', 'char_main', 'ishod', 'result', 'travma' ],
  smo_local: spravLocal.smo_local,
  mo_local: spravLocal.mo_local,
  okato: spravComs.okato,
  ist_fin: spravProf.ist_fin,
  purpose: spravLocal.purpose,
  doctor: spravLocal.doctor,
  doc_spec: spravProf.doc_spec,
  char_main: spravProf.char_main,
  cishod: spravProf.cishod,
  cresult: spravProf.cresult,
  travma_type: spravProf.travma_type,
  mkb10,
  templs: talonTempls.templs,
  //
  prefetch_pmus: spravPmus.pmus,
  pmu,
  pmu_grup,
  //
  card: $card,
  tal_pmu,
  talon
};


export const talons = {
  path: $path.talons,
  name: "Визиты",
  item: '/:card/:talon',
  add: '/add',
  def: clinicTalons,
};
