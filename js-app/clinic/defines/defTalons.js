// src/sparv/defines/spravPmus.js
// prof sprav definition

import { states, memost } from '../../apps/appApi';
//import { $upper, linkItem, smoId } from '../../apps/defines/defStruct';
//import { spravLocal } from '../../sprav/defines/defLocal';
//import { spravComs } from '../../sprav/defines/defComs';
import { fetch_form } from '../form/foTalon';
//import { _getFIO, cardValidator} from '../model/moCards';

// vitrual object 
export const talons_table = obj => new Proxy ( 
  obj, {
    get(target, prop) {
      if (['_tbl', 'tbl', 'tal_tbl'].indexOf(prop) > 0)
        return `talonz_clin_${states().year.slice(2)}`;
      return Reflect.get(target, prop);
    }  
});


const $talons = {
  // count talons in db table
  count: {
    rest: {
      url: 'rpc/get_tal_count', 
      method: "POST",
      params: talons_table({_tbl: ''})
    }
  },
  // fetch list of talons by fetch form params
  rest: {
    url: "rpc/talons_list",
    method: "POST",
    params: talons_table({
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
      crd_num: ['Карта', '', linkItem],
      fam: ['ФИО', '', _getFIO],
      birth_date: ['Дата рождения'],
      polis_num: ['Номер полиса']
    }
  }
};
/*
const talons = {
  rest: {
    url: 'rpc/crd_talons',
    method: 'POST',
    params: {
      tal_tbl: 'talonz_clin_20'
    },
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
*/

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
  //talon
};

export const talons = {
  path: '/talons',
  name: "Визиты",
  def: clinicTalons,
  //items: [],
  router: 'talons'
};