// src/sparv/defines/spravPmus.js
// prof sprav definition

import { states, memost } from '../../apps/appApi';
import { talons_table } from '../../apps/model/moList';
import { $upper, linkItem, smoId } from '../../apps/defines/defStruct';
import { spravLocal } from '../../sprav/defines/defLocal';
import { spravComs } from '../../sprav/defines/defComs';
import { fetch_form, person, insurance, address } from '../form/foCard';
import { _getFIO, cardValidator} from '../model/moCards';



const $cards = {
  // count crads in db table
  count: {
    rest: {
      url: 'rpc/get_crd_count',
      method: "POST",
      params: {
        _tbl: 'cardz_clin'
      },
      //headers: { 'Accept': 'application/json' }
    }
  },
  // fetch list of cards by fetch form params
  rest: {
    url: "rpc/cards_list",
    method: "POST",
    params: {
      _tbl: 'cardz_clin',
      lim: 50,
      offs: 1
    },
    //headers: { 'Accept': 'application/json' }
  },
  // form definition
  fetch: fetch_form,
  item: {
    header: "Поиск карт по номеру и пациенту",
    pk: 'crd_num',
    struct: {
      crd_num: ['Карта', '', linkItem],
      fam: ['ФИО', '', _getFIO],
      birth_date: ['Дата рождения'],
      polis_num: ['Номер полиса']
    }
  }
};


const talons = {
  rest: {
    url: 'rpc/crd_talons',
    method: 'POST',
    params: talons_table(states, {tal_tbl: ''}),
    body: ['crd_num']
  },
  item: {
    struct: {
      tal_num: ['Номер талона'],
      open_date: ['Открыт'],
      close_date: ['Закрыт'],
      purp: ['Цель визита'],
      doc_spec: ['Спец'],
      doc_code: ['Спец код'],
      family: ['Доктор'],
      ds1: ['Диагноз']
    }
  }
};


const ufms = {
  rest: {
    params: {
      order: 'code'
    },
    headers: {
      'Range': '0-1'
    }
  },
  fetch: {
    code: {
      alias: 'ufms',
      params: 'eq.'
    }
  }
};
  
const card = {
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
    header: "Карты",
    validator: cardValidator,
    rest: { 
      url: 'cardz_clin',  
      headers: {Prefer: 'return=representation'} 
    }
  },
  mainForm: {
    person,
    insurance,
    address
  }
};


export const clinicCards = {

  page: "Клиника: Карты",

  cards: $cards,
  talons,
  //card dependensies
  smo_local: spravLocal.smo_local,
  mo_local: spravLocal.mo_local,
  dul: spravComs.dul,
  okato: spravComs.okato,
  ufms,
  // card representation
  card
};

export const cards = {
  path: '/cards',
  name: "Карты",
  add: '/add',
  def: clinicCards,
  //items: [],
  router: 'cards'
};