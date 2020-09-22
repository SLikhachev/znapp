


import { checkArray } from '../utils';
import { vuDialog } from '../view/vuDialog';
import { _schema, errMsg } from './moModel';


const [stream, combine] = [m.stream, m.stream.combine];

export const listItem = stream({});
export const itemId = stream('');
export const changeValue = stream({});

export const target = (name, value) => ({ target: {name, value}});

export const getItem = (id, pk, list) => {
  if (!id) return {};
  for (let item of list) {
    if (item[pk] == id)
      return Object.assign({}, item);
  }
  return {}
};

/*
const getItem = itemid => {
  let id = itemid();
  if (!id) return {};
  for (let item of moList().list) {
    if (item[itemPk()] == id)
      return Object.assign({}, item);
  }
};
*/

const updateItem = (item, changed) => {
  // checkbox value (0, 1);
  //console.log(changed());
  const target = changed().target;
  let value = target.value;
  //console.log(target.name, value);

  if (target.type === 'submit')
    return Object.assign(item(),
      { method: target.getAttribute('method') || 'POST' });

  if (target.type === 'file') {
    value = target.value.split('\\').pop();
    return Object.assign(item(),
      { [target.name]: value, files: target.files[0] });
    //value = target.files[0];
  }

  if (target.type === 'checkbox') {
    if (target.checked)
      value = 1;
    else
      value = null;
  }
  /*
  if (target.tagname === 'select') {
    value = target.options[target.selectedIndex].value;
    console.log(value);
  }
  */
  return Object.assign(item(),
    { [target.name]: value });
};


export const changedItem = combine((itemid, newvalue, changed) => {
  if (changed.length > 1)
    return {}; // stream initialization 
  
  let c = changed[0]();
  if (typeof c === 'string' || typeof c === 'number') 
    // id is a string (number) mapped to item from list
    return listItem();
  
  // changed some value on blur 
  return updateItem(changedItem, newvalue);
}, [itemId, changeValue]);


const saveRequest = (set, item, _method, data) => {
  const rest = set[item].rest || {},
    _item = set[item].item || {},
    _fields = checkArray(_item.editable_fields) && 
      _item.editable_fields, //default all fields editable
    _key = _item.pk || 'id', // primary key may be vary
    _url = rest.url || item,
    _sign = _url.includes('?') ? '&' : '?';

  const params = {};

  // data request may be from call args params or changedItem stream  
  const _data = data || changedItem();
  let body = Object.assign({}, _data);

  //let method = changeEvent().method || '';
  let method = _method;
  if (!method) 
    return 'No METHOD provided to save Item';

  if (method === 'PATCH' || method === 'DELETE') {
    params[_key] = `eq.${body[_key]}`;
    delete body[_key];
  }
  if (method !== 'DELETE') {
    for (let k of Object.keys(body)) {
      if (_fields && _fields.indexOf(k) < 0) {
        delete body[k];
        continue;
      }
      if (body[k] === '' || body[k] === null) delete body[k];
    }

  } else {
    // restrict DELETE to PATCH only
    if (body.method !== method) {
      body = { ddel: 1 };
      method = 'PATCH';
    } else {
      // this for tru delete
      delete body.method;
      Object.keys(body).forEach(
        k => params[k] = `eq.${body[k]}`
      );
      body = null;

    }
  }
  const qstring = m.buildQueryString(params),
    url = `${_schema('pg_rest')}${_url}${_sign}${qstring}`,
    headers = rest.headers || {};
  console.log(url, method, body);  
  return { url, method, body, headers };
};


export const saveItem = (set, item, method, data = null) => {
  let reqwest = saveRequest(set, item, method, data);
  if ( typeof reqwest === 'string')
    return Promise.reject({ saverror: reqwest});
  return m.request(reqwest)
    .then(
      res => {
        if (vuDialog.dialog && vuDialog.dialog.open)
          vuDialog.close();
        return res; // return=representation
      },
      err => Promise.reject({ saverror: errMsg(err) })
    );
};

