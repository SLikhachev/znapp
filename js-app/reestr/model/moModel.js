
// src/report/model/moModel.js

import { errMsg } from '../../apps/model/moModel.js';

export const _month= () => {
    let d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
    m= m < 10 ? `0${m}`: `${m}`;
    return `${y}-${m}`;
  };

export const _schema= type=> {
  if (type === 'task')
    return window.localStorage.getItem('task_rest');
  return window.localStorage.getItem('pg_rest');
}

export const moModel = {
  
  getModel( url=null, order_by=null ) {
    //console.log(url);
    const model= {
      url: url,
      order_by: order_by,
      list: null,
      error: null,
      message: null,
      detail: null,
      file: null,
      done: false
    };  
    model.sort= e=> { e.preventDefault(); return false;};
    return model;
  },
  
  getList (schema, model, params=null, method='GET') {
    // filed - sort by with SELECT, default 'id' field
    //let schema = window.localStorage.getItem('pg_rest');
    //let id = model.field ? model.field : 'id',
    //order = `?order=${id}.asc`;
    let get_param= params ? '?' + m.buildQueryString(params) : '';
    let url= `${schema}${model.url}${get_param}`;
    //console.log(url);
    return m.request({
      url: url,
      method: method,
    }).then(function(res) {
      model.list = res; // list of objects
      model.order = true;
    }).catch(function(e) {
      model.error = errMsg(e);
      console.log(model.error);
    });
  },

  // simple CORS request with data as multipart form data and POST/GET
  // data have been got from FORM object
  formSubmit(event, schema, model, method) {
    let form= event.target;
    form.classList.add('disable');
    //let finput = form.elements.namedItem('file'),
    //file = finput.files[0],
    let data = new FormData(form);
    let get_param = '';
    if (method == "GET") {
      let get_data = {};
      data.forEach( (v, k) => { get_data[k] = v; } );
      get_param = '?' + m.buildQueryString(get_data);
    }
    const url= `${schema}${model.url}${get_param}`;
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
      model.file = res.file ? res.file: null;
      model.message = res.message;
      model.detail = res.detail ? res.detail: null;
      model.done = res.done ? res.done : null;
      //console.log(` msg: ${model.message}, file: ${model.file}, done: ${model.done}`);
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
    const url= `${schema}${model.url}`;
    //console.log(upurl);
    let fdata;
    if ( cors == 'simple' ) {
      fdata= new FormData();
      for (let k of Object.keys(data))
        fdata.append( k, data[k] );
    } else {
      fdata= data;
    }
    return m.request({
      url: url,
      method: method,
      body: fdata,
      timeout: 0
    }).then((res) => {
      model.file = res.file ? res.file: null;
      model.message = res.message;
      model.detail = res.detail ? res.detail: null;
      model.done = res.done ? res.done : null;
      event.target.parentNode.classList.remove('disable');
      return true;
    }).catch((err) => {
      model.error = errMsg(err);
      console.log(model.error);
      event.target.parentNode.classList.remove('disable');
      return false;
    });
  }

}
