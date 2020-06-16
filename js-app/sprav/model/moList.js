
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


const fetchParams = (fetch, tofetch) => {
  const params = {};
  //console.log(fetch, tofetch);
  let ps, val;
  if (fetch && tofetch) {
    Object.keys(fetch).forEach(
      fk => {
        val = changedItem()[fk] || '';
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
  if (!checkArray(rest.body))
    return null;
  const body = {};
  rest.body.forEach(p => {
    body[p] = changedItem()[p]
  });
  return body;
}


export const getRequest = (set, item, fetch) => {
  // fetch - String (may be bool)
  const rest = set[item].rest || {},
    _fetch = set[item].fetch || null,
    _url = rest.url || item,
    _sign = _url.includes('?') ? '&' : '?',
    _param = rest.params || { order: 'id.asc' },
    _item = set[item].item || {},

    //_fetch - object defines how build fetch params for getList
    params = fetchParams(_fetch, fetch);

  if (_item.editable && _item.editable.indexOf('del') >= 0)
    params.ddel = 'eq.0';

  const qstring = m.buildQueryString(Object.assign({}, params, _param)),
    url = `${_schema('pg_rest')}${_url}${_sign}${qstring}`,
    method = rest.method || 'GET',
    headers = rest.headers || {};
  const r = { url, method, headers };
  const b = makeBody(rest);
  if (!!b)
    r.body = b;
  return r;
};


export const getList = (set, item, fetch = '') => {
  // fetch - String (may be bool) as flag to build fetch params object for getList
  // default empty string
  return m.request(
    getRequest(set, item, fetch)
  ).then(
    res => {
      if (!!res && res.length && res.length > 0) {
        return { list: Array.from(res), order: true }; // list of objects
      } else
        return { list: [] };
    },
    err => ({ error: errMsg(err) }))
};

