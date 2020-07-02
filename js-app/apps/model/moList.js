
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


const fetchParams = (fetch, isfetch) => {
  const params = {};
  //console.log(fetch, tofetch);
  let ps, val;
  if (isfetch && fetch) {
    Object.keys(fetch).forEach(
      fk => {
        val = changedItem()[fk] || fetch[fk].value || '';
        if (!!val) {
          ps = fetch[fk].params || '';
          if (!!ps && (typeof ps === 'string')) {
            ps = ps.split('.');
            let tail = ps[1] || '';
            params[fk] = `${ps[0]}.${val}${tail}`;
          }
        }
      }
    );
  }
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
  // qfetch - String (may be bool) present is the fetch request
  const rest = set[item].rest || {},
    fetch = set[item].fetch || {},

    // url priority 1st: fetch, 2nd: rest, 3rd: item name
    _url = fetch.url || rest.url || item,

    _sign = _url.includes('?') ? '&' : '?',
    _param = rest.params || { order: 'id.asc' },
    _item = set[item].item || {},

    //_fetch - object defines how build fetch params for getList
    params = fetchParams(fetch, isfetch);

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

