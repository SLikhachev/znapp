
// src/sparv/defines/spravPmus.js
// prof sprav definition

import { states } from '../../apps/appApi';
import { linkItem } from '../../apps/defines/defStruct';
import { spravLocal } from '../../sprav/defines/defLocal';
import { spravComs } from '../../sprav/defines/defComs';
import { getFIO, _ufms } from '../common/utils';

$cards = text => ({
  placeholder: text,
  style: "font-size: 1.2em",
})

$upper = text => ({ placeholder: text, style: 'text-transform: uppercase' })

const $talons = () => states().data && states().data.get('talons').length

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
  ufms: {
    rest: {
      params: { order: 'code' },
      headers: { 'Range': '0-1' }
    },
    fetch: {
      code: {
        alias: 'ufms',
        params: 'eq.'
      }
    }
  },
  card: {
    rest: {
      url: "rpc/clin_card_by_num",
      method: "POST",
      params: { _tbl: 'cardz_clin' },
      data: ['card', 'talons'],
      options: ['mo_local', 'smo_local', 'dul', 'okato'],
      body: ['crd_num']
    },
    item: {
      header: "Карты",
    },
    form: {
      group1: {
        class: '.pure-u-7-24',
        fields: {
          crd_num: {
            label: ["Номер карты"],
            tag: ['', 'required'],
            attrs: { readonly: $talons }
          },
          fam: { label: [''], attrs: $upper("Фамилия") },
          im: { label: [''], attrs: $upper("Имя") },
          ot: { label: [''], attrs: $upper("Отчество") },
          birth_date: {
            label: ['Дата рождения'],
            tag: ['', 'required'],
            type: 'date'
          },
          gender: {
            label: ["Пол"],
            type: 'radio',
            radio: [
              { text: "M", value: 'м' },
              { text: "Ж", value: 'ж' }
            ]
          },
          dul_type: {
            label: ['Тип документа'],
            tag: ['.pure-u-1-5'],
            type: 'number',
            attrs: { min: 1, placeholder: "Число" }
          },
          dul_serial: {
            label: ["Документ"],
            attrs: { placeholder: "Серия" }
          },
          dul_number: {
            label: [''],
            attrs: { placeholder: "Номер" }
          },
          dul_date: {
            label: ['Дата выдачи'],
            type: 'date',
          },
          dul_org: {
            label: [' Кем выдан'],
            tag: ['.pure-u-7-12'],
            attrs: { style: "fonf-size: 1em; font-weight: normal" }
          },
          ufms: {
            label: ["УФМС"],
            tag: ['.pure-u-6-24'],
            type: 'number',
            attrs: { onblur: _ufms }
          }
        },
      },
    },
  }
}

export const cards = {
  path: '/cards',
  name: "Карты",
  def: clinicCards,
  //items: [],
  router: 'cards'
};