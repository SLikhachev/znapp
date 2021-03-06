
'use strict';

import { checkArray } from '../utils';
import { vuDialog } from '../view/vuDialog';
import { _schema, errMsg } from './moModel';

const [stream, combine] = [m.stream, m.stream.combine];

export const listItem = stream({});
export const itemId = stream('');
export const changeValue = stream({});

export const target = (name, value) => ({ target: { name, value } });

export const getItem = (id, pk, list) => {
  if (!id) return {};
  for (let item of list) {
    if (item[pk] == id)
      return Object.assign({}, item);
  }
  return {};
};

// callback for stream's states update 
const updateItem = (item, changed) => {
  // checkbox value (0, 1);
  //console.log(changed());
  const target = changed().target;
  let value = target.value;
  //console.log(target.name, value);

  // input type=submit may has a method attr 
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
    return 'moListItem.saveRequest --  No METHOD provided to save Item';

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
  let _data = data;
  if (!Array.isArray(data))
    _data = [data];
  let reqs = _data.map(d => saveRequest(set, item, method, d));
  let errs = reqs.filter(r => typeof r === 'string');

  if (checkArray(errs))
    return Promise.reject({ saverror: errs[0] });

  return Promise.all(reqs.map(r => m.request(r)))
    .then(
      res => {
        //console.log('then in saveItem of moListItem', res);
        if (vuDialog.dialog && vuDialog.dialog.open)
          vuDialog.close();
        return R.flatten(res); // return=representation // list
      },
      err => Promise.reject({ saverror: errMsg(err) })
    );
};

