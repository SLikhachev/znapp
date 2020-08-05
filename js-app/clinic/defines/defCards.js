// src/sparv/defines/spravPmus.js
// prof sprav definition

import { states, memost } from '../../apps/appApi';
import { $upper, linkItem, smoId } from '../../apps/defines/defStruct';
import { spravLocal } from '../../sprav/defines/defLocal';
import { spravComs } from '../../sprav/defines/defComs';
import { fetch_form, person, insurance, address } from '../form/foCard';
import { _getFIO } from '../model/moCards';


export const clinicCards = {

  page: "Клиника: Карты",

  cards: {
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
      //href: 'eq.',
      pk: 'crd_num',
      struct: {
        crd_num: ['Карта', '', linkItem],
        fam: ['ФИО', '', _getFIO],
        birth_date: ['Дата рождения'],
        polis_num: ['Номер полиса']
      }
    }
  },
  //card dependensies
  talons: {
    rest: {
      url: 'rpc/crd_talons',
      method: 'POST',
      params: {
        tal_tbl: 'talonz_clin_20'
      },
      body: ['crd_num']
    }
  },
  smo_local: spravLocal.smo_local,
  mo_local: spravLocal.mo_local,
  dul: spravComs.dul,
  okato: spravComs.okato,
  ufms: {
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
  },
  // card representation
  card: {
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
    },
    mainForm: {
      person,
      insurance,
      address
    }
  }
};

export const cards = {
  path: '/cards',
  name: "Карты",
  def: clinicCards,
  //items: [],
  router: 'cards'
};