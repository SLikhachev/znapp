
import { states } from '../../apps/appApi';
import { changedItem } from '../../apps/model/moListItem';


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

// takes okato object -> vnode
export const _okato = o => m(`option[value=${o.okato}]`,
  `${o.region}. ${o.name.split(' ')[0]}`
);


