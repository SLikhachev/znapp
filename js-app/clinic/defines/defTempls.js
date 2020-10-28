

'use strict';

import { $place } from '../../apps/defines/defStruct';
import { changedItem } from '../../apps/model/moListItem';
import { spravLocal } from '../../sprav/defines/defLocal';
import { spravProf } from '../../sprav/defines/defProf';
import { spravComs } from '../../sprav/defines/defComs';
import {
  talDate,
  talTarget,
  talVizits,
  talDs1,
  talDs2
} from '../form/foTalon';
import { tplValidator } from '../model/moTalons';
import { $path, mkb10 } from './defClinic';


export const tplPath = tpl => `${$path.templs}/${tpl}`;

const linkTpl = (row, key, pk) => ([
  m(m.route.Link, { href: `${$path.templs}/${row[pk]}` }, row.crd_num),
  '.choice.blue',
]);

export const tpl_to_save = [
  'tal_num', 'crd_num', 'talon_type',
  'ist_fin', 'first_vflag', 'finality', 'doc_spec', 'doc_code', 'purp',
  'usl_ok', 'for_pom', 'rslt', 'ishod', 'visit_pol', 'visit_daystac', 'prof_k',
  'ksk', 'ksg', 'sh', 'ds1', 'char1'
];

const fetch_form = {
  crd_num: {
    tag: ['.input-find.pure-u-3-4'],
    attrs: $place("Имя шаблона"),
    params: 'ilike.*'
  }
};

const struct = {
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

//const tplFilds = `tal_num,${Object.keys($struct).join(",")}`;

const rest = {
  url: "talonz_clin_tpl",
  params: {
    talon_type: 'gt.0',
    //select: tplFilds,
    order: 'tal_num.asc',
    limit: 50,
    offset: 0
  }
};

const _templs = {
  // fetch list of talons tpl by fetch form params
  rest,
  list: true,
  // form definition
  fetch: fetch_form,
  item: {
    header: "Шаблоны талонов",
    pk: 'tal_num',
    struct
  }
};


const templ = {
  rest: {
    url: "talonz_clin_tpl",
    params: {
      get tal_num() {
        return `eq.${changedItem().tal_num}`;
      }
    },
    data: ['templ'],
    //options_cards: ['mo_local', 'smo_local', 'dul', 'okato'],
    options: [
      'mo_local', 'smo_local', 'okato',
      'ist_fin', 'purpose', 'doctor',
      'char_main', 'cishod', 'cresult', 'travma_type'
    ],
  },
  item: {
    header: "Шаблоны Талонов",
    validator: tplValidator,
    rest: {
      url: 'talonz_clin_tpl',
      headers: { Prefer: 'return=representation' }
    },
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


export const talonTempls = {

  page: "Клиника: Шаблоны талонов",
  name: 'Templates',

  templs: _templs,

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
  templ
};


export const templs = {
  path: $path.templs,
  name: "Шаблоны",
  item: '/:talon',
  add: '/add',
  def: talonTempls,
};
