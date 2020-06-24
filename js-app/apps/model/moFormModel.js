
// src/apps/model/moModel.js

// this models is used by REESTR, REPORT apps 

import { _month, _schema, errMsg } from './moModel.js';


export const formItem = def => {
  let month = _month();
  if (def.task && def.task.form)
    return { month };
}

export const runTask = async function (event, promise) {
  event.target.classList.add('disable');
  const resp = document.getElementById('resp'); // taskResp - view with #resp dom
  resp.open = false;
  const res = await promise;
  resp.open = true;
  event.target.classList.remove('disable');
  return res;
};

const formRequest = (schema, suite, unit, data) => {
  const def = suite[unit] || {},
    _schema = def[schema] || {},
    _data = data ? data : changedItem(),
    _url = _schema.url || '',
    headers = _schema.headers || {},
    method = _data.method || 'POST';

  if (!_url) throw new Error('No URL for form Request provided');
  delete _data.method;

  let url = `${_schema(schema)}${_url}`;

  // request is SIMPLE if we send to serever Form Data not JSON object
  // with GET HEAD POST methods. 
  // WITH Any other methods preflight request is used
  // Allowed Content-Type headers is :
  // application/x-www-form-urlencoded
  // multipart/form-data
  // text/plain

  let body = {};

  if (method === 'GET') {
    url = `${url}?${m.buildQueryString(_data)}`;
    return { url, method, body, headers };
  }

  body = _data;

  // with POST we use simple request
  if (method === 'POST') {
    body = new FormData();
    Object.keys(_data).forEach(k =>
      body.append(k, _data[k])
    );
  }
  return { url, method, body, headers };
}

// 
export const formSubmit(schema, suite, unit, data) {
  const reqBody = formRequest(schema, suite, unit, data);
  reqBody.timeout = 0
  return m.request(reqBody).then(
    res => ({ res }),
    err => ({ error: errMsg(err) })
  );
}


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
