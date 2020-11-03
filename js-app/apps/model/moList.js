
'use strict';

import { checkArray } from '../utils';
import { _schema, _year, errMsg } from './moModel';
import { changedItem } from './moListItem';


export const sortList = (id, state) => {
  let { list, order } = state();
  const prop = R.prop([id]);
  let ord = order ? R.descend(prop) : R.ascend(prop);
  return {
    list: R.sort(ord, list),
    order: !order
  };
};

// dot param like
//  params: 'like.*' 
const _dot_param = (ps, val) => {
  let par, tail, _ps = ps;

  if (typeof ps === 'function')
    _ps = ps();

  if (!R.isNil(_ps) && (typeof _ps === 'string') &&
    _ps.includes('.')) {
    par = _ps.split('.'); // array[String, String]
    tail = par[1] || '';
    return `${par[0]}.${val}${tail}`;
  }
  return val;
};


// make object from fetch and changedItem
const fetchParams = (fetch, fetch_str) => {
  //console.log(fetch)
  let params = {};
  Object.keys(fetch).reduce((acc, key) => {
    // alias for case where key string not present in changedItem
    // but alias string present

    let ps = fetch[key].params,

      // may be additionsl key in form 'FETCH_ds2' 
      str_key = fetch_str.split('_')[1],

      // order: str_key, alias, key
      alias = str_key || fetch[key].alias || key,

      // if not provided dynamically get it statically from value prop
      val = changedItem()[alias] || fetch[key].value;

    // fetch[key].value may be empty string or 0 so we need isNil
    if (!R.isNil(val)) acc[key] = _dot_param(ps, val);
    return acc;
  }, params);
  //console.log(params);
  return params;
};

// special array for additional form of POST RPC call 
// (as options to main request)
const makeRestBody = rest => {
  const body = {};
  if (checkArray(rest.body))
    rest.body.forEach(p => {
      body[p] = changedItem()[p];
    });
  return body;
};

// ONLY REST object used for request building, 
// exclude params from FETCH form, these are processed separately
// ALLOWED methods GET POST
export const getRequest = (set, item, isfetch = '') => {
  // set:: def Object ref,
  // item:: String current eName 
  // rest { url, method, headers, params, body}

  let def = set[item];

  if (R.isNil(def))
    return `getRequest: Нет свойства ${item} а определении объета запроса`;

  let rest = def.rest || {},
    fetch = def.fetch || {},
    params = {};

  // isfetch - String (may be bool) present is the fetch request 
  // fetch used ONLY for build query from CHANGED ITEM nothing else
  if (isfetch && R.isEmpty(fetch))
    return `getRequest: Нет объекта FETCH для ${item}`;
  else
    params = fetchParams(fetch, isfetch);

  //console.log(params);
  // url priority 1st: fetch, 2nd: rest, 3rd: item name
  // used by tasks in feych to select task item from 
  // task table (last file here)
  const _url = rest.url || item,
    method = rest.method || 'GET',
    headers = rest.headers || {},
    _sign = (method === 'GET') ? (_url.includes('?') ? '&' : '?') : '',
    _param = rest.params || { order: 'id.asc' },
    _item = def.item || {};

  //dynamic _param replaced by proxy
  //Object.keys(_param).forEach( k=> typeof _param[k] === 'function' ? 
  //  _param[k] = _param[k]() : void 0 );

  // assume every deletable entity table have ddel column  
  if (_item.editable && _item.editable.indexOf('del') >= 0)
    params.ddel = 'eq.0';

  // _PARAMS MAY BE PROXY
  //Object.keys(_param).forEach( k => console.log(k, _param[k]) );
  let data = Object.assign({}, params, _param);

  let qstring = '';
  if (method === 'GET')
    qstring = m.buildQueryString(data);

  let url = `${_schema('pg_rest')}${_url}${_sign}${qstring}`;
  let r = { url, method, headers };

  if (method === 'GET') {
    console.log('GET', r);
    return r;
  }
  //const body = new FormData();
  // simetimes we need body if this is RPC call for option object e.g.

  let b = Object.assign(data, makeRestBody(rest));
  //Object.keys(b).forEach(k => body.append(k, b[k]));
  //r.body = body;
  r.body = b;
  console.log('POST', r);
  return r;
};


export const getList = (set, item, isfetch = '') => {
  // isfetch - String (may be bool) 
  // as flag to build fetch params object for getList
  // default empty string
  //return Promise.reject({ error: ' xer xer ' });
  let r = getRequest(set, item, isfetch);
  if (typeof r === 'string')
    return Promise.reject({ error: `getList: ${r}` });
  return m.request(r).then(
    // mithril send 2 request for cross-site 
    // 1st with OPTION if request is prefilght 
    // 2nd with real POST 
    res => {
      if (!R.isNil(res)) {
        if (typeof res === 'object') {
          if (res.length && res.length > 0) {
            return { list: Array.from(res), order: true }; // list of objects
          } else {
            return { list: [] };
          }
        }
        return res.toString();
      }
      return Promise.reject({ error: `getList: Nil response: ${res}` });
    },
    err => Promise.reject({ error: `getList: ${errMsg(err)}` }));
};

