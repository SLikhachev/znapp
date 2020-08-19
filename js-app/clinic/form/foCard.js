// card pages forms definition

import { states, memost } from '../../apps/appApi';
import { $upper, smoId } from '../../apps/defines/defStruct';
import { _ufms } from '../model/moCards';
import {
  item_attr,
  check_opts,
  polis_type,
  set_polis_type,
  set_okato_by_smo,
  _okato,
} from '../model/moModel';


const $cards = text => ({
  placeholder: text,
  style: "font-size: 1.2em",
});

const blurst = e => memost(e.target.name);

const $talons = () => Boolean(states().data && 
  states().data.get('talons') &&
  states().data.get('talons').length);

const $name = text => ({
  label: [''],
  attrs: $upper(text)
});

const $city = text =>({attrs: $upper(text)});

const $home_tag = text => ({ 
  tag: ['.pure-u-1-8'],
  attrs: {
    placeholder: text
  }
});

const $home = () => ({
  home_g: $home_tag("Дом"),
  corp_g: $home_tag("Корп"),
  flat_g: $home_tag("Кв")
});

const $phone = text => ({ attrs: {  placeholder: text }});


// FETCH CARD form
export const fetch_form = {
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
};
//-------------------------------


// PERSON fields def
export const person = {
  class: '.pure-u-7-24',
  fields: {
    //
    crd_num: {
      label: ["Номер карты"],
      tag: ['', 'required'],
      attrs: {
        readonly: $talons // call in make tag
      }
    },
    //
    fam: R.assoc('tag', ['', 'required'], $name("Фамилия")),
    im: $name("Имя"),
    ot: $name("Отчество"),
    //
    birth_date: {
      label: ['Дата рождения'],
      tag: ['', 'required'],
      type: 'date'
    },
    //
    gender: {
      label: ["Пол"],
      type: 'radio',
      radio: [{
        text: "M",
        value: 'м'
      }, {
        text: "Ж",
        value: 'ж'
      }]
    },
    //
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
        min: 1,
        placeholder: "Число",
        onblur: blurst //dummy call for redraw
      }
    },
    //
    dul_serial: {
      label: ["Документ"],
      attrs: {
        placeholder: "Серия"
      }
    },
    //
    dul_number: {
      label: [''],
      attrs: {
        placeholder: "Номер"
      }
    },
    //
    dul_date: {
      label: ['Дата выдачи'],
      type: 'date',
    },
    //
    ufms: {
      label: ["УФМС"],
      tag: ['.pure-u-6-24'],
      type: 'number',
      attrs: {
        onblur: _ufms
      }
    },
    //
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
};
//------------------------------------------

// INSURANCE fields def
export const insurance = {
  class: '.pure-u-8-24',
  fields: {
    legend: "ОМС",
    //
    polis_ser: {
      label: ["Полис серия"],
    },
    //
    polis_num: {
      label: ["Номер"],
      tag: ['', 'required'],
      type: 'number',
      memo: {
        check: polis_type,
        attrs: {
          style: "margin-left: 11em;"
        }
      },
      attrs: {
        min: 1,
        onblur: set_polis_type
      }
    },
    //
    smo: {
      label: ["СМО"],
      //tag: [''],
      type: 'select',
      options: smoId,
      attrs: {
        onblur: set_okato_by_smo
      },
    },
    //
    smo_okato: {
      label: ["Регион"],
      attrs: {
        list: "okato",
        options: _okato
      }
    },
    //
    mo_att: {
      label: ["Прикреплен к МО"],
      tag: ['.pure-u-1-6'],
      type: 'number',
      memo: {
        check: check_opts,
        params: ['mo_local', 'mo_att', 'scode', item_attr('sname')],
        attrs: {
          style: "display: block; margin: 1em 0; padding-left: 1em"
        },
      },
    },
  },
};
//----------------------------------

// PERSON ADDRESS fields def
export const address = {
  class: '.pure-u-9-24',
  fields: {
    legend: "Адрес",
    //
    city_g: $city("Город"),
    street_g: $city("Улица"),
    //
    'fields_group': $home(),
    //
    phone_wrk: $phone("Мобильный тел"),
    phone_hom: $phone("Контактный тел")
  }
};