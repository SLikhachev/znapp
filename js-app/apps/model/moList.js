
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
  if (ps && ps.includes('.')) {
    par = ps.split('.'); // array[String, String]
    tail = par[1] || '';
    return `${par[0]}.${val}${tail}`;
  }
  return val;
}

const fetchParams = (fetch, isfetch) => {
  let params = {};
  //console.log(params);
  // there 'url' prop is in fetch object 
  if (isfetch && fetch) {
    Object.keys(fetch).reduce((acc, key) => {
      let val = changedItem()[key] || fetch[key].value || null,
        ps = fetch[key].params || null;

      // string (url e.g) will be ignored
      if (!!val) acc[key] = _dot_param(ps, val);
      return acc;
    }, params);
  }
  //console.log(params);
  return params;
};


const makeBody = rest => {
  const body = {};
  if (checkArray(rest.body))
    rest.body.forEach(p => {
      body[p] = changedItem()[p]
    });
  return body;
}


export const getRequest = (set, item, isfetch) => {
  // set:: def Object ref,
  // item:: String current eName 
  // isfetch - String (may be bool) present is the fetch request
  const rest = set[item].rest || {},
    fetch = set[item].fetch || {},
    // url priority 1st: fetch, 2nd: rest, 3rd: item name
    _url = (isfetch && fetch.url) ? fetch.url : (rest.url || item),

    _sign = _url.includes('?') ? '&' : '?',
    _param = Boolean(isfetch) ? {} : (rest.params || { order: 'id.asc' }),
    _item = set[item].item || {};

  // fetch - object defines how build fetch params for getList

  const params = fetchParams(fetch, isfetch);
  //console.log(params);

  // assume every deletable entity table have ddel column  
  if (_item.editable && _item.editable.indexOf('del') >= 0)
    params.ddel = 'eq.0';

  const qstring = m.buildQueryString(Object.assign({}, params, _param)),
    url = `${_schema('pg_rest')}${_url}${_sign}${qstring}`,
    method = rest.method || 'GET',
    headers = rest.headers || {};
  const r = { url, method, headers };
  const b = makeBody(rest);
  if (!R.isEmpty(b))
    r.body = b;
  return r;
};


export const getList = (set, item, isfetch = '') => {
  // isfetch - String (may be bool) 
  // as flag to build fetch params object for getList
  // default empty string
  return m.request(
    getRequest(set, item, isfetch)
  ).then(
    res => {
      if (!!res && res.length && res.length > 0) {
        return { list: Array.from(res), order: true }; // list of objects
      } else
        return { list: [] };
    },
    err => ({ error: errMsg(err) }))
};

