
'use strict';

//import { _month } from '../../apps/model/moModel.js';
import { $place, $upper, $checkbox } from '../../apps/defines/defStruct';
import { card } from '../defines/defCards';
import { talonCardValidator } from '../model/moCards';
import {
  _check,
  check_dul,
  check_att,
  opt_key_value,
  id_name,
} from '../model/moModel';
import {
  _doctor,
  set_ds, 
  _memo_ds
} from '../model/moTalons';


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

export const $card = {
  rest: card.rest,
  item: {
    validator: talonCardValidator,
    rest: { 
      url: 'cardz_clin',  
      headers: {Prefer: 'return=representation'}
    }
  },
  form: {
    fields: {
      fam: $name("Фамилия"),
      im: $name("Имя"),
      ot: $name("Отчество"),
      birth_date: {
        label: ["Дата рождения"],
        tag: ['', 'required'],
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
        //attrs: $none,
        type: 'memo',
        memo: {
          check: check_dul
        }  
      },
      mo_att: {
        //attrs: $none,
        type: 'memo',
        memo: {
          check: check_att
        }  
      },
    }
  }
};


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


const $twrap = { klass: '.pure-u-2-24' }; 

export const talTarget = {
  class: '.pure-g',
  fields: {
    ist_fin: {
      wrap: $twrap,
      label: ["Оплата"],
      tag: ['.pure-u-22-24', 'required'],
      type: "number",
      attrs: {
        list: "ist_fin",
        options: id_name
      }
    },
    purp: {
      wrap: $twrap,
      label: ["Цель"],
      tag: ['.pure-u-22-24', 'required'],
      type: 'number',
      attrs:{
        list: 'purpose',
        options: id_name
      }
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
      //attrs: $none,
      type: 'memo',
      memo: {
        check: _doctor,
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
      //attrs: $none,
      type:'memo',
      memo: {
        check: _check,
        params: ["Количество посещений"]
      }
    }
  }
};

const $dwrap = { klass: '.pure-u-3-24'};

const $diag = d => ({
  wrap: {
    klass: '.pure-u-10-24',
    attrs: {
      style: "padding-top: 2em ; font-size: 1.1em; font-weight: 500"
    }
  },
  type: 'memo',
  memo: {
    check: _memo_ds,
    params: [d]
  }
});


export const talDs1 = {
  class: '.pure-g',
  fields: {
    ds1: {
      wrap: $dwrap,
      label: ["Осн. диагноз"],
      tag: ['.input.pure-u-20-24', 'required'],
      attrs: {
        oninput: set_ds,
        list: 'ds1',
        options: opt_key_value('code', 'name')
      }
    },
    char1: {
      wrap: $dwrap,
      label: ["Характер"],
      tag: ['.input.pure-u-16-24', 'required'],
      attrs: {
        list: 'char_main',
        options: id_name
      }
    },
    ishod: {
      wrap: $dwrap,
      label: ["Исход"], 
      tag: ['.input.pure-u-16-24', 'required'],
      attrs: {
        list: 'cishod',
        options: id_name
      }
    },
    rslt: {
      wrap: $dwrap,
      label: ["Результат"], 
      tag: ['.input.pure-u-16-24', 'required'],
      attrs: {
        list: 'cresult',
        options: id_name
      }
    },
    diagnose: $diag('ds1')
  }
};


export const talDs2 = {
  class: '.pure-g',
  fields: {
    ds2: {
      wrap: $dwrap,
      label: ["Доп. диагноз"],
      tag: ['.input.pure-u-20-24'],
      attrs: {
        oninput: set_ds,
        list: 'ds2',
        options: opt_key_value('code', 'name')
      }
    },
    char2: {
      wrap: $dwrap,
      label: ["Характер"], 
      tag: ['.input.pure-u-16-24'],
      attrs: {
        list: 'char_main',
        options: id_name
      }
    },
    travma_type: {
      wrap: $dwrap,
      label: ["Травма"], 
      tag: ['.input.pure-u-14-24'],
      attrs: {
        list: 'travma_type',
        options: id_name
      }
    },
    diagnose: $diag('ds2') 
  }
};


/*
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