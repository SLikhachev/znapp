// src/apps/model/moModel.js

// this models is used by SPRAV CLINIC apps

import { vuDialog } from '../view/vuDialog.js';


export const errMsg = function (error) {
  if (!error)
    return 'Ошибка сервера (детали в журнале)';
  let e = error.response ? error.response : 'Ошибка сервера (пустой ответ)';
  let m = e.details ? e.details : e.message ? e.message : e;
  //let m= e.message ? e.message : error;
  console.log(m);
  return m;
};

// return date in yyyy-mm format
export const _month = () => {
  let d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
  m = m < 10 ? `0${m}` : `${m}`;
  return `${y}-${m}`;
};

export const _year = () => _month().split('-')[0]; // on init app year,

// return posgrest url if pg_rest else task url
export const _schema = type => {
  if (type === 'task')
    return window.localStorage.getItem('task_rest');
  return window.localStorage.getItem('pg_rest');
};

//export const _region= ()=> int(window.localStorage.getItem('smo_reg'));

export const _region = () => '25.';

export const _mo = () => window.localStorage.getItem('this_mo');


/*
export const moModel = {

  // :: String -> Array -> String -> Object
  // ret models object (POJO)
  getModel(
    { url = null, method = "GET", options = null, order_by = 'id', editable = null, change = null, key = 'id' } = {}
  ) {
    /*
      url - string of model's REST API url
      method - string of model's REST method
      options - array of strings of option tables names, required for complex views of this model
        need for form data select/option if any
      order_by - string "order by" with initially SELECT 
      editable - array defines is model could changed
      change - array editable fields names
      key - primary key for sql model table dafault id
    *//*
    let model = {
      url: url,
      method: method,
      order_by: order_by,
      options: options,
      editable: editable,
      change: change,
      key: key,
      list: null, // main data list (showing in table page)
      data: new Map(), // every idx corresponds with index of options array
      item: null,
      error: null, // Promise all error
      order: true, // for list
      sort: null, // for list
      save: null,
    };
    model.sort = field => moModel.sort(model, field);
    model.getItem = id => {
      model.item = {};
      if (id === null) return false;
      let key = model.key;
      for (let it of model.list) {
        if (it[key] == id) {
          model.item = Object.assign({}, it);
          break;
        }
      }
      return false;
    };

    return model;
  },
  // :: Object -> Promise
  // ret Promise
  // model = {field, url, method,  }
  getList(model) {
    model.list = null;
    const method = model.method ? model.method : 'GET';
    // filed - sort by with SELECT, default 'id' field
    //let schema = window.localStorage.getItem('pg_rest');
    const schema = _schema('pg_rest');
    const id = model.order_by ? model.order_by : 'id';
    let url = `${model.url}`;
    let sign = url.includes('?') ? '&' : '?';
    if (model.editable && model.editable.indexOf('del') >= 0) {
      url = `${url}${sign}ddel=eq.0`;
      sign = '&';
    }
    url = `${schema}${url}${sign}order=${id}.asc`;
    console.log(url);
    return m.request({
      method: method,
      url: url,
      headers: model.headers ? model.headers : null
    }).then(function (res) {
      //console.log(res);
      if (!Boolean(res)) return false;
      if (res.length && res.length > 0) {
        model.list = Array.from(res); // list of objects
        model.order = true;
      } else
        model.list = [];
      return true;
    }).catch(function (err) {
      //console.log(err);
      model.error = errMsg(err);
      return false;
    });
  },
  // :: Object -> undef
  // return Promise all
  getData(model) {
    if (model.options === null) return false;
    //let schema = window.localStorage.getItem('pg_rest');
    let schema = _schema('pg_rest');
    let data = [];
    //morder= model.order ? model.order : 'id';
    //order= `?order=${morder}.asc`;
    model.options.forEach(t => {
      let id = t.order_by ? t.order_by : 'id';
      let sign = t.url.includes('?') ? '&' : '?';
      let order = `${sign}order=${id}.asc`;

      let r = m.request({
        method: t.method ? t.method : "GET",
        url: schema + t.url + order
      });
      data.push(r);
    });
    // order should preserved
    return Promise.all(data).then((lists) => {
      model.data.clear(); // = new Map();
      let key;
      for (let el of model.options.entries()) {
        // entries [ idx, value ]
        if (!Boolean(lists[el[0]])) continue; // no data for this option
        key = el[1].url;
        if (key.includes('?')) // only table name as key, ignore all rest query
          key = el[1].url.split('?')[0]
        model.data.set(key, lists[el[0]]); // el[1] option object
      }
      //window.localStorage.setItem(model.opt_name, model.data);
      //model.data = _.zipObject( model.options, lists);
      //console.log( model.list );
      return true;
    }).catch(function (err) {
      model.error = errMsg(err);
      throw model.error;
    });

  },

  // :: Object -> String -> String -> Object -> Promise
  // return Promise
  getViewRpc(model, data, url = null, method = null) {
    //let schema = window.localStorage.getItem('pg_rest');
    let schema = _schema('pg_rest');
    let _url = url ? url : model.url;
    let _method = method ? method : model.method;
    let headers = model.headers ? model.headers : null;
    return m.request({
      url: schema + _url,
      method: _method,
      body: data,
      headers: headers
    }).then(res => {
      //console.log(res);
      if (!Boolean(res)) return false;
      if (res.length && res.length > 0) {
        //console.log(res);
        model.list = Array.from(res); // list of objects
        model.order = true;
        return true;
      } else
        model.list = [{ recount: res }];
      return false;
    }).catch(err => {
      let msg = errMsg(err);
      model.error = msg;
      return Promise.reject(msg);
    });
  },

  getViewRpcMap(model, data) {
    let schema = _schema('pg_rest');
    let reqs = [];
    for (let [idx, url] of model.url.entries()) {
      let r = m.request({
        method: model.method[idx],
        url: schema + url,
        body: data[idx]
      });
      reqs.push(r);
    }
    // order should preserved
    return Promise.all(reqs).then((lists) => {
      // map data must be Map
      //model.map_data.clear(); // = new Map();
      for (let [idx, key] of model.map_keys.entries()) {
        //model.map_data.set( name, lists[ idx ]);
        if (!Boolean(lists[idx])) continue;
        if (lists[idx].length && lists[idx].length > 0) {
          //model[key]= lists[ idx ];
          model[key] = Array.from(lists[idx]);
          //console.log(lists[idx]);
        } else
          model[key] = [];
      }
      return true;
      return Promise.resolve(true);
    }).catch(function (err) {
      model.error = errMsg(err);
    });
  },

  sort(model, id = null) {
    //console.log(id);
    let order = model.order ? 'desc' : 'asc';
    let field = id ? id : 'id';
    model.list = _.orderBy(model.list, [field], [order]);
    //console.log(model.list);
    model.order = !model.order;
  },

  /** getFormData
    return item's data object 
  *//*

  getFormData(form, isSetOnly = false) {
    // form - dom form
    // isSetOnly - set out only
    let data = {};
    //let da = [];
    let text = $(':input', form);
    Array.from(text).forEach((el) => {
      if (!!el.name)
        data[el.name] = el.value;
    });
    return data;
  },

  /** formSubmit
    return false    
  *//*

  formSubmit(event, model, method) {
    //console.log(model);
    event.target.parentNode.classList.add('disable');
    const schema = _schema('pg_rest');
    let url = schema + model.url;
    const key = model.key ? model.key : 'id';
    let data = Object.assign({}, model.item);
    const sign = model.url.includes('?') ? '&' : '?';
    let _method = method; // 
    if (_method === 'PATCH' || _method === 'DELETE') {
      url += `${sign}${key}=eq.${data[key]}`;
      if (data[key]) delete data[key];
    }
    if (_method !== 'DELETE') {
      for (let k of Object.keys(data)) {
        if (model.change && model.change.indexOf(k) < 0) {
          delete data[k];
          continue;
        }
        if (data[k] === '') delete data[k];  //data[k] = null;
      }
    } else {
      // restrict DELETE to PATCH only
      data = { ddel: 1 };
      _method = 'PATCH';
    }

    model.save = { err: false, msg: '' };
    return m.request({
      url: url,
      method: _method,
      body: data,
      //async: false,
      headers: model.headers
    }).then(res => {
      event.target.parentNode.classList.remove('disable');
      if (model.list) moModel.getList(model);
      if (vuDialog.dialog && vuDialog.dialog.open) vuDialog.close();
      return res;
    }).catch(err => {
      let msg = errMsg(err);
      model.save = { err: true, msg: msg };
      event.target.parentNode.classList.remove('disable');
      return Promise.reject(msg);
    });
  }
};
*/

