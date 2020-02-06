// src/sprav/view/vuDoctor.js

import { fieldFrom } from '../../apps/form/foForm';
import { itForm } from '../form/foItem';
import { vuSheet } from './vuSheet';

// label = [class, text], if null no label
// input = tag = [class, type, tabindex (int), required(bool)]
const Item = {
  family: { label: ['', "Фамилия"], input: {
      tag: ['', "text", 1, true],
      attrs: { autofocus: true }
    }
  },
  name: { label: ['', 'Имя'], input: {
      tag: ['.fname', 'text', 2],
    }
  },
  sname: { label: ['', 'Отчество'], input: {
      tag: ['.fname', 'text', 3],
    }
  },
  snils: { label: ['', 'СНИЛС'], input: {
      tag: ['.fname', 'text', 4, true],
    }
  },
  code: { label: ['', 'Код'], input: {
      tag: ['.lcode', 'number', 5, true],
    }
  },
  spec: { label: ['', 'Специальность'], input: {
      tag: ['.lcode', 'number', 6, true],
    }
  },
  division:  { label: ['', 'Отделение'], input: {
      tag: ['.lcode', 'number', 7],
    }
  },
  district: { label: ['', 'Участок'], input: {
      tag: ['.lcode', 'number', 8],
    }
  },
  tabid: { label: ['', 'Таб. номер'], input: {
      tag: ['.fname', 'number', 9],
    }
  }
}

const docFields= ['family', 'name', 'sname', 'snils', 'code', 'spec', 'division', 'district', 'tabid'];

const itemForm= vnode => itForm(
    docFields,
    (f, d, a={}) => fieldFrom(Item, f, d, a),
    vnode);

export const vuDoctor = function (vnode) {
  vnode.attrs.itemForm= itemForm;
  return vuSheet(vnode);
}
