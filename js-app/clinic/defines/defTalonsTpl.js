

'use strict';

import { states } from '../../apps/appApi';
import { $place } from '../../apps/defines/defStruct';
import { talons_table } from '../model/moModel';
import { spravLocal } from '../../sprav/defines/defLocal';
import { spravProf } from '../../sprav/defines/defProf';
import { spravComs } from '../../sprav/defines/defComs';
import { spravPmus } from '../../sprav/defines/defPmus';
import { 
  talDate,
  talTarget,
  talVizits,
  talDs1,
  talDs2
} from '../form/foTalon';
import { $path } from './defClinic';
import { mkb10 } from './defTalons';


export const tplPath = tpl => `${$path.tal_tpls}/${tpl}`;

const linkTpl = (row, key, pk) => ([
  m(m.route.Link, { href: `${$path.tal_tpls}/${row[pk]}`}, row.crd_num),
  '.choice.blue',
]);


const fetch_form = {
  crd_num: {
    tag: ['.input-find.pure-u-3-4'],
    attrs: $place("Имя шаблона"),
    params: 'ilike.*'
  }
};

const $struct = {
  crd_num: ['Шаблон', '', linkTpl],
  ist_fin: ['Ист. фин.'],
  doc_spec: ['Специальность'],
  doc_code: ['Код доктора'],
  purp: ['Цель'],
  rslt: ['Результат'],
  ishod: ['Исход лечения'],
  ksg: ['КСГ'],
  sh: ['Схема лечения']
};

const tplFilds = `tal_num,${Object.keys($struct).join(",")}`;

const $rest= {
  url: "talonz_clin_tpl",
  params: {
    talon_type: 'gt.0',
    select: tplFilds,
    order: 'tal_num.asc',
    limit: 50,
    offset: 0
  }
};

const $tal_tpls = {
  // fetch list of talons tpl by fetch form params
  rest: $rest,
  list: $rest,
  // form definition
  fetch: fetch_form,
  item: {
    header: "Шаблоны талонов",
    pk: 'tal_num',
    struct: $struct
  }
};

/*
const talonTpl = {
  rest: {
    url: "",
    method: "POST",
    params: talons_table(states, {tbl: ''}),
    data: ['talon','tal_pmu'],
    //options_cards: ['mo_local', 'smo_local', 'dul', 'okato'],
    options: [
      'mo_local', 'smo_local', 'okato',
      'ist_fin', 'purpose', 'doctor', 
      'char_main', 'cishod', 'cresult', 'travma_type' 
    ],
    body: ['_tal']
  },
  item: {
    header: "Талоны",
    validator: talonValidator,
    rest: talons_table(states, {
      url: '',
      headers: {Prefer: 'return=representation'}
    }),
    item: { pk: 'tal_num' }
  },
  mainForm: {
    talDate,
    talTarget,
    talVizits,
    talDs1,
    talDs2
  },
};

*/
export const clinicTalonsTpl = {

  page: "Клиника: Шаблоны Талонов",
  name: 'tal_tpls',
  
  tal_tpls: $tal_tpls,
  
  //talon dependensies
  //options: [ 'ist_fin', 'purp', 'doctor', 'char_main', 'ishod', 'result', 'travma' ],
  smo_local: spravLocal.smo_local,
  mo_local: spravLocal.mo_local,
  okato: spravComs.okato,
  ist_fin: spravProf.ist_fin,
  purpose: spravLocal.purpose,
  doctor: spravLocal.doctor,
  char_main: spravProf.char_main,
  cishod: spravProf.cishod,
  cresult: spravProf.cresult,
  travma_type: spravProf.travma_type,
  mkb10,
  //tal_tpl
};


export const tal_tpls = {
  path: $path.tal_tpls,
  name: "Шаблоны",
  item: '/:tpl',
  add: '/add',
  def: clinicTalonsTpl,
};
