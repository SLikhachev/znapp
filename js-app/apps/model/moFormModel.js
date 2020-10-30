
// src/apps/model/moModel.js

// this module is used by TASK server wiith REESTR, REPORT apps 

import { _month, _schema, errMsg } from './moModel.js';
import { changedItem } from './moListItem';

// used by Actions to set initial form data
export const formItem = (suite, unit) => {
  const form = {}, def = suite[unit];
  if (def.task && def.task.form)
    Object.entries(def.task.form).reduce((f, el) => {
      let [p, v] = el, I = v.attrs && v.attrs['data-initial'];
      f[p] = !!I ? (typeof I === 'function') ? I() : I.toString() : '';
      return f;
    }, form);
  return form;
};


// used by task server
const formRequest = (api, suite, unit, data) => {
  const def = suite[unit] || {},
    _api = def[api] || {},
    _data = data ? data : changedItem(),
    headers = _api.headers || {},
    method = _data.method || 'POST',
    _url = _api.url || '';

  if (!_url) throw new Error(
    'moFormModel.formRequest -- No URL for form Request provided');
  delete _data.method;

  let url = `${_schema(api)}${_url}`;

  // request is SIMPLE if we send to serever Form Data not JSON object
  // with GET HEAD POST methods. 
  // WITH Any other methods preflight request is used
  // Allowed Content-Type headers is :
  // application/x-www-form-urlencoded
  // multipart/form-data
  // text/plain

  if (method === 'GET') {
    url = `${url}?${m.buildQueryString(_data)}`;
    return { url, method, headers };
  }

  let body = _data; // json object

  // with POST we use simple request
  if (method === 'POST') {
    body = new FormData();
    Object.entries(_data).reduce((b, el) => {
      let [k, v] = el;
      if (!!v) {
        if (k === 'file' && _data.file && _data.files) {
          b.append('file', _data.files, _data.file);
          _data.files = void 0;
        }
        b.append(k, v);
      }
      return b;
    }, body);
  }
  return { url, method, body, headers };
}

// // used by TASK server
export const formSubmit = (api, suite, unit, data) => {
  const reqBody = formRequest(api, suite, unit, data);
  reqBody.timeout = 0
  return m.request(reqBody).then(
    res => ({
      done: res.done || false,
      message: res.message || '',
      detail: res.detail || '',
      file: res.file || ''
    }),
    err => ({ error: errMsg(err) })
  );
};
