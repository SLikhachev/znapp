
//import { _month } from '../../apps/model/moModel.js';
import { $place, $upper, $checkbox } from '../../apps/defines/defStruct';
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


const $date = text => ({
  wrap: {klass: '.pure-u-4-24' },
  label: [text],
  tag: ['.pure-u-22-24', 'required'],
  type: 'date', 
  attrs: {style: "height: 45%",}
});

const $flag = text => R.assoc(
  'wrap', { klass: '.pure-u-3-24'}, 
  $checkbox(text)
);


export const talDate = {
  class: '.pure-g',
  fields: {
    open_date: $date("Открыт"),
    close_date: $date("Закрыт"), 
    talon_month: { 
      wrap: { klass: '.pure-u-3-24'},
      label: ["Месяц талона", '.leg_sec.red'], 
      tag: ['.pure-u-12-24.tal_month', 'required'],
      type: 'number',
      attrs: { style: "height: 45%", min: 1, max: 12} ,
    },
    mek: R.assocPath(['wrap', 'attrs', 'style'], 
      'padding-top: 2em;', $flag("МЭК")),
    'fields_group': {
      wrap: { 
        klass: '.pure-u-6-24', 
        attrs: { style:  'padding-top: 2em;' } },
      urgent: $checkbox("Неотложный"),
      first_vflag: $checkbox("Первичный")
    }
  }
};

const $check = a=> a[0];

const $twrap = { klass: '.pure-u-2-24' }; 

export const talTarget = {
  class: '.pure-g',
  fields: {
    ist_fin: {
      wrap: $twrap,
      label: ["Оплата"],
      tag: ['.pure-u-18-24', 'required'],
      type: "number",
    },
    purp: {
      wrap: $twrap,
      label: ["Цель"],
      tag: ['.pure-u-18-24', 'required'],
      type: 'number',
    },
    doc_spec: {
      wrap: $twrap,
      label: ["Врач"],
      tag: ['.pure-u-22-24', 'required'],
      type: "number",
      attrs: {
        placeholder: "Спец"
      }
    },
    doc_code: {
      wrap: $twrap,
      label: ["Код"],
      tag: ['.pure-u-22-24', 'required'],
      type: 'number'
    },
    doctor: {
      wrap: {
        klass: '.pure-u-10-24',
        attrs: {
          style: 'padding-top: 2em ; font-size: 1.1em; font-weight: 500;'
        }
      },
      attrs: $none,
      memo: {
        check: $check,
        params: ['Доктор']
      }
    }
  }
};


const $vizd = text => ({
   wrap: $twrap,
   label: [text],
   tag: ['.pure-u-20-24'],
   type:'number'
});


export const talVizits = {
  class: '.pure-g',
  fields: {
    vizit_pol: $vizd("Амбул"),
    vizit_home: $vizd("На дом"),
    vizits:{
      wrap: {
        klass: '.pure-u-6-24',
        attrs: { style: 
          "padding-top: 2em ; font-size: 1.2em; font-weight: 600" 
        }
      },
      attrs: $none,
      memo: {
        check: $check,
        params: ["Количество посещений"]
      }
    }
  }
};

const $dwrap = { klass: '.pure-u-3-24'};

/*
export const talDs1 = {
  class: '.pure-g',
  fields: {
    ds1: {
      wrap: $dwrap,
    }
  }
}

m('.pure-u-3-24', [
            m('label', "Осн. диагноз"),
            m('input.input.pure-u-20-24[type=text][tabindex=13][required]', {
              list: 'ds1', value: tal.ds1, oninput: set_ds1
            }),
            m('datalist[id="ds1"]',
              ds1_model.list ? ds1_model.list.map(d=> m('option', {value: `${d.code.trim()}~${d.name}` } )) : []
            )
          ]),
          m('.pure-u-3-24', [ tof('char1', tal, { list:  "char", onblur: set_char1 } ),
            m('datalist[id="char"]',
              data.get('char_main').filter(c => c.id < 4).map(c=>
                m('option', { value: `${c.id}. ${c.name.split(' ')[0]}` })
              )
            )
          ]),
          m('.pure-u-3-24', [ tof('ishod', tal, { list:  "ishod", onblur: set_ishod} ),
            data_list('ishod', 'cishod')
          ]),
          m('.pure-u-3-24', [ tof('rslt', tal, { list:  "result", onblur: set_result} ),
            data_list('result', 'cresult')
          ]),
          m(".pure-u-10-24", {
              style: "padding-top: 2em ; font-size: 1.1em; font-weight: 500"
            }, ds_show(tal.ds1)
          ),
        ]),
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