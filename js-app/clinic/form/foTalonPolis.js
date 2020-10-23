
import { smoId } from '../../apps/defines/defStruct';
import {
  polis_type_prompt,
  set_polis_type,
  set_okato_by_smo,
  _okato,
} from '../model/moModel';
import { $legend } from './foForm';

const polis = {
  class: 'div',
  fields: {
    polis_ser: {
      label: ["Полис серия"],
    },
    //
    polis_num: {
      label: ["Номер"],
      type: 'number',
      memo: {
        check: polis_type_prompt,
      },
      attrs: {
        min: 1, 
        onblur: set_polis_type
      }
    },
    //
    smo: {
      label: ["СМО"],
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
    }
  }
};

export const polisForm = {
  legend: $legend("Полис на дату визита"), 
  legend1: $legend(`
    (если заполнен используется в реестре вместо полиса карты)`
  ),
  polis
};

