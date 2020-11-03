
'use strict';

import { $legend } from './foForm';


const dsVizits = {
  class: '.pure-g',
  fields: {
    vizit_daystac: {
      wrap: {
        klass: '.pure-u-2-24'
      },
      label: ["Дн. стац"],
      tag: ['.pure-u-20-24'],
      type: 'number',
    },
    vizit_homstac: {
      wrap: {
        klass: '.pure-u-2-24'
      },
      label: ["Стац. дом"],
      tag: ['.pure-u-20-24'],
      type: 'number',
    },
  }
};

const dsKsg = {
  class: '.pure-g',
  fields: {
    ksg: {
      wrap: { klass: '.pure-u-2-24' },
      label: ["КСГ"],
      tag: ['.pure-u-20-24'],
    },
    prof_k: {
      wrap: { klass: '.pure-u-2-24' },
      label: ["Проф. койки"],
      tag: ['.pure-u-20-24'],
      type: 'number'
    },
    sh: {
      wrap: { klass: '.pure-u-2-24' },
      label: ["Схема"],
      tag: ['.pure-u-20-24'],
    }
  }
};

export const dstacForm = {
  leg_dstac: $legend("Дневной стационар"),
  dsVizits,
  dsKsg
};

