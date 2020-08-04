
// src/sparv/defines/spravPmus.js
// prof sprav definition

import { states, memost } from '../../apps/appApi';
import { linkItem, smoId } from '../../apps/defines/defStruct';
import { spravLocal } from '../../sprav/defines/defLocal';
import { spravComs } from '../../sprav/defines/defComs';
import { 
  item_attr, 
  check_opts,
  polis_type,
  set_polis_type,
  set_okato_by_smo,
  _okato,
} from '../model/moModel';

import {
  _getFIO,
  //_dul_type,
  _ufms,
  //_polis_type,
  //_okato,
  //_mo_att,
  //_set_okato_by_smo
} from '../model/moCards';

const blurst = e => memost(e.target.name);

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
  // card representation
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
    mainForm: {
      person: {
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
            memo: {
              check: check_opts,
              params: ['dul', 'dul_type', 'code', item_attr('short_name')]
            },
            attrs: {
              style: 'margin-right: 1em;',
              min: 1, placeholder: "Число",
              onblur: blurst //dummy call for redraw
            }
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
          ufms: {
            label: ["УФМС"],
            tag: ['.pure-u-6-24'],
            type: 'number',
            attrs: { onblur: _ufms }
          },
          dul_org: {
            //label: [' Кем выдан'],
            //tag: ['.pure-u-7-12'],
            tag: ['.pure-u-1-1'],
            memo: {
              check: check_opts,
              params: ['dul_org', 'ufms', 'code', item_attr('name')]
            },
            attrs: {
              style: "fonf-size: 1em; font-weight: normal; text-transform: uppercase",
              placeholder: "Кем выдан"
            }
          },
        },
      },
      insurance: {
        class: '.pure-u-8-24',
        fields: {
          legend: "ОМС",
          polis_ser: {
            label: ["Полис серия"],
          },
          polis_num: {
            label: ["Номер"],
            tag: ['', 'required'],
            type: 'number',
            memo: {
              check: polis_type,
              attrs: { style: "margin-left: 11em;" }
            },
            attrs: { min: 1, onblur: set_polis_type }
          },
          smo: {
            label: ["СМО"],
            //tag: [''],
            type: 'select',
            options: smoId,
            attrs: { onblur: set_okato_by_smo },
          },
          smo_okato: {
            label: ["Регион"],
            attrs: {
              list: "okato",
              options: _okato
            }
          },
          mo_att: {
            label: ["Прикреплен к МО"],
            tag: ['.pure-u-1-6'],
            type: 'number',
            memo: {
              check: check_opts,
              params: ['mo_local', 'mo_att', 'scode', item_attr('sname')],
              attrs: { style: "display: block; margin: 1em 0; padding-left: 1em" },
            },
          },
        },
      },
      address: {
        class: '.pure-u-9-24',
        fields: {
          legend: "Адрес",
          city_g: {
            attrs: $upper("Город")
          },
          street_g: {
            attrs: $upper("Город")
          },
          fields_group: {
            home_g: {
              tag: ['.pure-u-1-8'],
              attrs: { placeholder: "Дом" }
            },
            corp_g: {
              tag: ['.pure-u-1-8'],
              attrs: { placeholder: "Корпус" }
            },
            flat_g: {
              tag: ['.pure-u-1-8'],
              attrs: { placeholder: "Кв" }
            },
          },
          phone_wrk: {
            attrs: { placeholder: "Мобильный тел" }
          },
          phone_hom: {
            attrs: { placeholder: "Контактный тел" }
          }
        }
      }
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