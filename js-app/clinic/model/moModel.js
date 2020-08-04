
import { states } from '../../apps/appApi';
import { changedItem, changeValue } from '../../apps/model/moListItem';


//export const memost = m.stream({});

export const _just_int = (text, length = 0) => {
  if (typeof text !== 'string' || text.length < length)
    return NaN;
  return parseInt(text);
};


export const item_attr = attr => item => item[attr];

// Array -> String
export const check_opts = params => { 
  let [data, field, find, fn] = params;
  // data - String -> key in data MAP to get
  // field - String form field name cantains the value to find
  // find - String -> prop in data array item to find
  // fn - output with find item
  fn = typeof fn === 'function' ? fn : x=>x;
  let value = changedItem()[field], opts = states().options;
  let notfind = `red&Нет элемента ${find}-${value} в списке ${data}`;

  //console.log('find_opt', data, field, find, value);
  if (!value || !opts)
    return ''; 
  
  let list = opts.get(data) || null;
  
  if (R.isNil(list))
    return null;

  if (list[0] && list[0].error) // after disp fetch error 
      return list[0].error;
  
  let item = list.find(it => it[find].toString() == value);
  if (item !== undefined)
      return fn(item);

  return notfind;
};

const change = (name, value) => changeValue( { target: { name, value }} );

const _ptype = type => ({
    3: "ЕНП 16 цифр",
    2: `Временное свидетельсто 9 цифр`,
    1: `Старый полис`,
    0: `red&Тип полиса неизвестен`
  }[type]
);

export const polis_type = () => _ptype( changedItem().polis_type );

const calc_type = () => {
  let s = 0, n = 0 ;
  if (!!changedItem().polis_ser)
    s = changedItem().polis_ser.toString().length;
  if (!!changedItem().polis_num)
    n = changedItem().polis_num.toString().length;
  
  if (s === 0 && n === 16)
    return 3;
  
  //if (s === 0 && n > 0 && n < 16)
  if (s === 0 && n === 9)
    return 2;
  
  if (s > 0 && n > 0)
    return 1;
  
  return 0;
}

export const set_polis_type = () => change('polis_type', calc_type());

export const set_okato_by_smo = () => {
  // there had to be set SMO
  let smo = changedItem().smo;
  //console.log('smo ok ', smo )
  if (!smo)
    return false;
  let _smo = states().options.get('smo_local').find(item => item.code == smo);
  if (_smo) {
    //console.log(_smo.okato);
    change('smo_okato', _smo.okato);
  }
  return false;
};

// takes okato object -> vnode
export const _okato = o => m(`option[value=${o.okato}]`,
  `${o.region}. ${o.name.split(' ')[0]}`
);



