
//import { _month } from '../../apps/model/moModel.js';
import { $place, $upper } from '../../apps/defines/defStruct';
import {
  check_dul,
  check_att
} from '../model/moModel';


const tag = ['.input-find.pure-u-2-3'];

const $none = { style: 'display: none' };

const $name = text => ({
  label: [''],
  tag: ['.pure-u-22-24'],
  attrs: $upper(text)
});


export const fetch_form = {
  q_tal: {
    tag,
    type: 'number',
    attrs: $place("Номер талона"),
    value: 1
  },
  q_crd: {
    tag,
    attrs: $place("Номер карты"),
    value: '.*'
  },
  q_date: {
    type: 'date',
    value: '2010-01-01'
  }
};

export const card = {
  form: {
    fields: {
      fam: $name("Фамилия"),
      im: $name("Имя"),
      ot: $name("Отчество"),
      birth_date: {
        label: ["Дата рождения"],
        type: 'date',
      },
      crd_polis_ser: {
        label: ["Полис (редактируем в карте)"],
        tag: ['', 'readonly'],
        attrs: {
          placeholder: "Серия"
        }
      },
      crd_polis_num: {
        label: [''],
        tag: ['', 'readonly'],
        attrs: {
          placeholder: "Номер"
        }
      },
      crd_smo: {
        label: ["СМО"],
        tag: ['', 'readonly']
      },
      dul_serial: {
        attrs: $none,
        memo: {
          check: check_dul
        }  
      },
      mo_att: {
        attrs: $none,
        memo: {
          check: check_att
        }  
      },
    }
  }
};

// label = [class, text]
// input = tag = [class, type, required]

/*
const month = function () {
    let d = new Date();
    return d.getMonth() + 1;
 };
*/
/*
m(".pure-u-4-24", tof('open_date', tal)),
          m(".pure-u-4-24", tof('close_date', tal)),
          m('.pure-u-3-24', tof('talon_month', tal)),
          
          m('.pure-u-3-24', {style: "padding-top: 2em"},
            tof('mek', tal, { onclick: e=> set_chk(e, 'mek') }) ),
          m(".pure-u-6-24", {style: "padding-top: 2em"}, [
            tof('urgent', tal, { onclick: e=> set_chk(e, 'urgent') }),
            tof('first_vflag', tal, { onclick: e=> set_chk(e, 'first_vflag') }),
           
*/
const $date = text => ({
  wrap: '.pure-u-4-24',
  label: [text], 
  tag: ['.pure-u-22-24', 'required'],
  type: 'date', 
  attrs: {style: "height: 45%",}
});

const flag = text => ({
  wrap: '.pure-u-3-24',
  label: [text], 
  type: 'checkbox',
  attrs: {style: "margin-right: 0.7em"}
});

export const talDate = {
  class: '.pure-g',
  fields: {
    open_date: $date("Открыт"),
    close_date: $date("Закрыт"), 
    talon_month: { 
      wrap: '.pure-u-3-24',
      label: ["Месяц талона", '.leg_sec.red'], 
      tag: ['.pure-u-12-24.tal_month', 'required'],
      type: 'number',
      attrs: { style: "height: 45%", min: 1, max: 12} ,
    },
    mek: flag("МЭК"),
    urgent: flag("Неотложный"),
    first_vflag: flag("Первичный")
  }
};
/*
    'fields_group': {
      wrap: '.pure-u-6-24',
      attrs: { "padding-top: 2em" },
      urgent: { 
        label: [], 
        type: "checkbox", 
        attrs: {style: "margin-right: 0.7em" }
      },
      
        label: [], 
        type: "checkbox",
        attrs: {style: "margin-right: 0.7em"}
      }
      finality: { 
        label: ['', "Закончен", 'check'], input: {
      tag: ['', "checkbox", 6,  false],
      attrs: {style: "margin-right: 0.7em"}
    }
      
    }
    }
    

  },
  
    }
  },
  mek: { 
    }
  },
  u
  },
  
  first_vflag: { label: ['', "Первичный", 'check'], input: {
      tag: ['', "checkbox", 6, false],
      attrs: {style: "margin-right: 0.7em"}
    }
  },
  /*
  finality: { label: ['', "Закончен", 'check'], input: {
      tag: ['', "checkbox", 6,  false],
      attrs: {style: "margin-right: 0.7em"}
    }
  },
  */


  /*
  ist_fin: { label: ['', "Оплата"], input: {
      tag: ['.pure-u-18-24', "text", 7, true],
      //attrs: { min: 1, max: 9}
    }
  },
  purp: { label: ['', "Цель"], input: {
      tag: ['.pure-u-18-24', 'number', 8, true],
      attrs: { min: 0, max: 33}
    }
  },
  doc_spec: { label: ['', "Врач"], input: {
      tag: ['.pure-u-22-24', "number", 9, true],
      attrs: { placeholder: "Спец"}
    }
  },
  doc_code: { label: ['', "Код"], input: {
      tag: ['.pure-u-22-24', "number", 10, true]
    }
  },
  visit_pol: {label: ['', "Амбул"], input: {
    tag: ['.pure-u-20-24', 'number', 11]
    }
  },
  visit_home: {label: ['', "На дом"], input: {
      tag: ['.input.pure-u-20-24', "number", 12]
    }
  },
  ds1: {label: ['', "Осн. диагноз"], input: {
      tag: ['.input.pure-u-20-24', "text", 13, true]
    }
  },
  char1: {label: ['', "Характер"], input: {
      tag: ['.input.pure-u-16-24', "text", 14, true],
    }
  },
  ishod: {label: ['', "Исход"], input: {
      tag: ['.input.pure-u-16-24', "text", 15, true]
    }
  },
  rslt: {label: ['', "Результат"], input: {
      tag: ['.input.pure-u-16-24', "text", 16, true]
    }
  },
  ds2: {label: ['', "Доп. диагноз"], input: {
      tag: ['.input.pure-u-20-24', "text", 17]
    }
  },
  char2: {label: ['', "Характер"], input: {
      tag: ['.input.pure-u-16-24', "text", 18]
    }
  },
  travma_type: {label: ['', "Травма"], input: {
      tag: ['.input.pure-u-14-24', "text", 19]
    }
  },
};

export const pmuAdd = {
  code_usl: { label: ['', 'Код ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4', "text"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  ccode: { label: ['', 'Номер ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4', "number"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  grup: { label: ['', 'Группа ПМУ'], input: {
      tag: ['.input-find.pure-u-3-4', "number"],
      //attrs: { placeholder: 'Номер' }
    }
  },
  
};

*/