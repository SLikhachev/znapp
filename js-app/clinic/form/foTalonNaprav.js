
import { $checkbox } from '../../apps/defines/defStruct';

const $legend = text =>({
  class: 'legend',
  fields: {
    lend: {
      type: 'memo',
      memo: { check: () => text }
    }  
  }
});

const naprDate = {
  class: '.pure-g',
  fields: {
    npr_date: {
      wrap: { klass: '.pure-u-22-24'},
      label: ["Дата направления"],
      type: 'date'
    },
  },
};

const naprLech = {
  class: '.pure-g',
  fields: {
    npr_mo: {
      wrap: {
        klass: '.pure-u-2-24'
      },
      label: ["Код МО"],
      tag: ['.pure-u-22-24'],
      type: 'number',
    },
    npr_spec: {
      wrap: {
        klass: '.pure-u-2-24'
      },
      label: ["Спец"],
      tag: ['.pure-u-22-24'],
      type: 'number',
    },
    naprlech: {
      wrap: {
        klass: '.pure-u-5-24'
      },
      label: ["Номер направления"],
      tag: ['.pure-u-22-24'],
      type: 'number'
    }
  },
};

const naprHosp = {
  class:  '.pure-g',
  fields: {
    hosp_mo: { 
      wrap : { klass: '.pure-u-2-24'},
      label: ["Код МО"], 
      tag: ['.pure-u-22-24'], 
      type: 'number'
    },
    nsndhosp: { 
      wrap : { klass: '.pure-u-5-24' },
      label: ["Номер направления"], 
      tag: ['.pure-u-22-24'], 
      type: 'number'
    },
    extr: R.assoc(
      'wrap', { 
        klass: '.pure-u-8-24', 
        attrs: { style: 'margin-top: 2.2em;' }
      }, 
      $checkbox('Экстренно')
    )
  } 
};
 
export const naprForm = {
  naprDate,
  leg_lech: $legend("Направление: лечение. диагностика, консультация"),
  naprLech,
  leg_hosp: $legend("Госпитализация"),
  naprHosp
};

