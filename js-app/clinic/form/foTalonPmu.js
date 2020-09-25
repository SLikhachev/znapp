
import { states, disp } from '../../apps/appApi';
import { changedItem, changeValue, target } from '../../apps/model/moListItem';
import { _tupper, pmu_table, opt_key_value } from '../model/moModel';


const usl_txt = "^[A-Z][0-9]{2}.[0-9]{2}$"; 
const usl_code = new RegExp( usl_txt );
//---------------------------------------

export const set_usl = e => {
  (e.target.value = _tupper(e.target.value));
  changeValue(e);
  let code = e.target.name;
  if ( usl_code.test(changedItem()[code]) )
    disp(['fetch_toOptions', 'prefetch_pmus', code]);
  return false;
};

const wrap = { klass: '.pure-u-1-4'};
const tag= ['.input-find.pure-u-3-4'];

export const pmuForm = {
  class: '.pure-g',
  fields: {
    code_usl: {
      wrap, 
      tag, 
      label: ["Код ПМУ"],
      attrs: {
        oninput: set_usl,
        list: 'code_usl',
        options: opt_key_value('code_usl', 'ccode')
      }
    },
    ccode: { 
      wrap,
      tag,
      label: ["Номер ПМУ"], 
      type: "number",
    },
    grup: {
      wrap,
      tag,
      label: ["Группа ПМУ"],
      type: "number",
    },
    button: {
      wrap,
      label: ["Добавить"],
      tag: ['.pure-button.pure-button-primary'],
      type: 'submit',
      attrs: { style: 'margin-top: 1.7em' }
    }
  }
};

export const tal_pmu = {
  rest: {
    url: 'rpc/get_tal_pmu',
    method: "POST",
    params: pmu_table(states, {tbl: ''}),
    body: ['_tal']
  },
  item: {
    //validator: talonCardValidator,
    header: "Поиск талонов по номеру талона, карты или дате",
    struct: {
      ccode: ['Номер'],
      code_usl: ['Код услуги'],
      kol_usl: ['Кол-во'],
      name: ['Наименование'],
      exec_spec: ['Спец'],
      exec_doc: ['Спец код'],
      exec_podr: ['Подр'],
      tarif: ['Тариф 5/2']
    }
  },
  form: pmuForm
};

export const pmu = {
  fetch: {
    code_usl: {
      params: 'eq.'
    },
    ccode: {
      params: 'eq.'
    }
  }
};

export const pmu_grup = {
  rest: {
    url: 'rpc/get_grc',
    method: 'POST',
    params: {}
  },
  fetch: {
    id: {
      alias: 'grup'
    }
  }
}
