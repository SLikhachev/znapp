
// src/sparv/defines/spravPmus.js
// prof sprav definition

import { linkItem } from '../../apps/defines/defStruct';
import { spravLocal } from '../../sprav/defines/defLocal';
import { spravComs } from '../../sprav/defines/defComs';
import { getFIO } from '../common/utils';

$cards = text => ({
  placeholder: text,
  style: "font-size: 1.2em",
})

const crdEmpty = (name, header) => ({
  type: 'empty',
  name,
  header
});

crdMainTab = crdEmpty("Карта", "Карта пациента");
crdVizTab = crdEmpty("Визиты", "Визиты");

crdExtTab = crdEmpty("Дополнительно", "Дополнительно");
crdAttTab = crdEmpty("Прикрепить", "Прикрепить");
crdDelTab = crdEmpty("Удалить", "Удалить/Объеденить");


export const clinicCards = {

  page: "Клиника: Карты",

  cards: {
    // count crads in db table
    count: {
      rest: {
        url: 'rpc/get_crd_count',
        method: "POST",
        params: { _tbl: 'cardz_clin' },
        //headers: { 'Accept': 'application/json' }
      }
    },
    // fetch list of cards by fetch form params
    rest: {
      url: "rpc/cards_list",
      method: "POST",
      params: { _tbl: 'cardz_clin', lim: 50, offs: 1 },
      //headers: { 'Accept': 'application/json' }
    },
    // form definition
    fetch: {
      q_crd: {
        tag: ['.input-find.pure-u-3-4'],
        attrs: $cards("Номер карты"),
        value: ''
      },
      q_fam: {
        tag: ['.input-find.pure-u-2-3'],
        attrs: $cards("Фамилия"),
        value: '',
      },
      q_im: {
        tag: ['.input-find.pure-u-2-3'],
        attrs: $cards("Имя"),
        value: ''
      },
    },
    item: {
      header: "Поиск карт по номеру и пациенту",
      //href: 'eq.',
      pk: 'crd_num',
      struct: {
        crd_num: ['Карта', '', linkItem],
        fam: ['ФИО', '', getFIO],
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
      params: { tal_tbl: 'talonz_clin_20' },
      body: ['crd_num']
    }
  },
  smo_local: spravLocal.smo_local,
  mo_local: spravLocal.mo_local,
  dul: spravComs.dul,
  okato: spravComs.okato,
  card: {
    rest: {
      url: "rpc/clin_card_by_num",
      method: "POST",
      params: { _tbl: 'cardz_clin' },
      data: ['card', 'talons'],
      options: ['mo_local', 'smo_local', 'dul', 'okato'],
      body: ['crd_num']
    },
    tabsdef: [crdMainTab, crdVizTab, crdExtTab, crdAttTab, crdDelTab],
    item: {
      header: "Карты",
    }
  }
}


export const cards = {
  path: '/cards',
  name: "Карты",
  def: clinicCards,
  //items: [],
  router: 'cards'
};