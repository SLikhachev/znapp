
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
}

// used by task server
const formRequest = (api, suite, unit, data) => {
  const def = suite[unit] || {},
    _api = def[api] || {},
    _data = data ? data : changedItem(),
    headers = _api.headers || {},
    method = _data.method || 'POST',
    _url = _api.url || '';

  if (!_url) throw new Error('No URL for form Request provided');
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

/*
export const moModel = {

  getModel(url = null, order_by = null) {
    //console.log(url);
    const model = {
      url: url,
      order_by: order_by,
      href: null,
      list: null,
      error: null,
      message: null,
      detail: null,
      file: null,
      done: false
    };
    model.sort = e => { e.preventDefault(); return false; };
    return model;
  },

  getList(schema, model, params = null, method = 'GET') {
    // filed - sort by with SELECT, default 'id' field
    //let schema = window.localStorage.getItem('pg_rest');
    //let id = model.field ? model.field : 'id',
    //order = `?order=${id}.asc`;
    let get_param = params ? '?' + m.buildQueryString(params) : '';
    let url = `${schema}${model.url}${get_param}`;
    //console.log(url);
    return m.request({
      url: url,
      method: method,
    }).then(function (res) {
      model.list = res; // list of objects
      model.order = true;
      return true
    }).catch(function (e) {
      model.error = errMsg(e);
      console.log(model.error);
    });
  },



  // simple CORS request with data as multipart form data and POST/GET
  // data have been got from FORM object
  formSubmit(event, schema, model, method) {
    const form = event.target;
    form.classList.add('disable');
    //let finput = form.elements.namedItem('file'),
    //file = finput.files[0],
    const data = new FormData(form);
    let get_param = '';
    if (method == "GET") {
      let get_data = {};
      data.forEach((v, k) => { get_data[k] = v; });
      get_param = '?' + m.buildQueryString(get_data);
    }
    const url = `${schema}${model.url}${get_param}`;
    //console.log(get_param);
    //data.append("test", form.elements.namedItem('test'));
    //data.append("month", form.elements.namedItem('month'));
    //data.append("file", file);
    //console.log(data.getAll('test')[0], data.getAll('month')[0]);
    //data.append("")
    return m.request({
      url: url,
      method: method,
      body: data,
      timeout: 0
    }).then((res) => {
      model.file = res.file ? res.file : null;
      model.message = res.message;
      model.detail = res.detail ? res.detail : null;
      model.done = res.done ? res.done : null;
      console.log(` msg: ${model.message}, file: ${model.file}, done: ${model.done}`);
      form.classList.remove('disable');
      return true;
    }).catch((err) => {
      model.error = errMsg(err);
      console.log(model.error);
      form.classList.remove('disable');
      return false;
    });
  },



  // submit with simple / preflight CORS request   
  doSubmit(event, schema, cors, model, data, method) {
    event.target.parentNode.classList.add('disable');
    //console.log(data);
    const url = `${schema}${model.url}`;
    //console.log(upurl);
    let fdata;
    // request is SIMPLE if we send to serever Form Data not JSON object
    // with GET HEAD POST methods. WITH Any other methods preflight request is used
    // Allowed Content-Type headers is :
    // application/x-www-form-urlencoded
    // multipart/form-data
    // text/plain
    if (cors == 'simple') {
      fdata = new FormData();
      for (let k of Object.keys(data))
        fdata.append(k, data[k]);
    } else {
      fdata = data;
    }
    return m.request({
      url: url,
      method: method,
      body: fdata,
      timeout: 0
    }).then((res) => {
      model.file = res.file ? res.file : null;
      model.message = res.message;
      model.detail = res.detail ? res.detail : null;
      model.done = res.done ? res.done : null;
      event.target.parentNode.classList.remove('disable');
      return res.done;
    }).catch((err) => {
      model.error = errMsg(err);
      console.log(model.error);
      event.target.parentNode.classList.remove('disable');
      return false;
    });
  }

}
*/