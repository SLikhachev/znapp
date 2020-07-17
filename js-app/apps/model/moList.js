
import { _schema, errMsg, checkArray } from './moModel';
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

const _dot_param = (ps, val) => {
  let par, tail;
  if (!R.isNil(ps) && (typeof ps === 'string')
    && ps.includes('.')) {
    par = ps.split('.'); // array[String, String]
    tail = par[1] || '';
    return `${par[0]}.${val}${tail}`;
  }
  return val;
}

// make object from fetch and changedItem
const fetchParams = fetch => {
  let params = {};
  //console.log(params);
  // 
  Object.keys(fetch).reduce((acc, key) => {
    let ps = fetch[key].params,
      val = changedItem()[key] || fetch[key].value;
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
      body[p] = changedItem()[p]
    });
  return body;
}

// ONLY REST object used for request building, 
// exclude params from FETCH form, these process separately
// ALLOWED methods GET POST
export const getRequest = (set, item, isfetch) => {
  // set:: def Object ref,
  // item:: String current eName 
  // rest { url, method, headers, params, body}
  const rest = set[item].rest || {},
    fetch = set[item].fetch || {};
  let params = {};

  // isfetch - String (may be bool) present is the fetch request 
  // fetch used ONLY for build query from CHANGED ITEM nothing else
  if (isfetch && R.isEmpty(fetch))
    return 'Нет объекта FETCH';
  else
    params = fetchParams(fetch);

  // url priority 1st: fetch, 2nd: rest, 3rd: item name
  // used by tasks in feych to select task item from 
  // task table (last file here)
  const _url = rest.url || item,
    method = rest.method || 'GET',
    headers = rest.headers || {},
    _sign = (method === 'GET') ? (_url.includes('?') ? '&' : '?') : '',
    _param = rest.params || { order: 'id.asc' },
    _item = set[item].item || {};

  // assume every deletable entity table have ddel column  
  if (_item.editable && _item.editable.indexOf('del') >= 0)
    params.ddel = 'eq.0';

  let data = Object.assign({}, params, _param);

  let qstring = '';
  if (method === 'GET')
    qstring = m.buildQueryString(data);

  let url = `${_schema('pg_rest')}${_url}${_sign}${qstring}`;
  let r = { url, method, headers };

  if (method === 'GET')
    return r;

  //const body = new FormData();
  // simetimes we need body if this is RPC call for option object e.g.

  let b = Object.assign(data, makeRestBody(rest));
  //Object.keys(b).forEach(k => body.append(k, b[k]));
  //r.body = body;
  r.body = b
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
    return Promise.reject({ error: r });
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
        return res;
      }
    },
    err => ({ error: errMsg(err) }))
};

