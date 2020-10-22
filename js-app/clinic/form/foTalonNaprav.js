
import { $checkbox } from '../../apps/defines/defStruct';
import { _naprav1 } from '../model/moTalons';
import { $legend } from './foForm';


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
    },
    
  },
};

const naprav1 = {
  class: '.pure-g',
  fields: {
    naprav1: {
      wrap: {
        klass: '.pure-u-10-24',
        attrs: {
          style: 'padding-bottom: 2em; font-size: 1.1em; font-weight: 500;'
        }
      },
      type: 'memo',
      memo: {
        check: _naprav1,
      }
    }
  }
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
  naprav1,
  leg_hosp: $legend("Госпитализация"),
  naprHosp
};

