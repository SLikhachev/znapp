// src/apps/model/moModel.js

// this models is used by SPRAV CLINIC apps

//import { vuDialog } from '../../apps/view/vuDialog';


export const errMsg = function (error) {
  if (!error)
    return 'Ошибка сервера (детали в журнале)'
  let e = error.response ? error.response : 'Ошибка сервера (пустой ответ)';
  let m = e.details ? e.details : e.message ? e.message : e;
  //let m= e.message ? e.message : error;
  console.log(m);
  return m;
}

// return date in yyyy-mm format
export const _month = () => {
  let d = new Date(), y = d.getFullYear(), m = d.getMonth() + 1;
  m = m < 10 ? `0${m}` : `${m}`;
  return `${y}-${m}`;
};

// return posgrest url if pg_rest else task url
export const _schema = type => {
  if (type === 'task')
    return window.localStorage.getItem('task_rest');
  return window.localStorage.getItem('pg_rest');
}

//export const _region= ()=> int(window.localStorage.getItem('smo_reg'));

export const _region = () => '25.';

export const _mo = () => window.localStorage.getItem('this_mo');

export const checkArray = a => !!a && Array.isArray(a) && a.length > 0 ? true : false;


// :: Object -> undef
// return Promise all
const getData = (model) => {
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

};

// :: Object -> String -> String -> Object -> Promise
// return Promise
const getViewRpc = (model, data, url = null, method = null) => {
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
};

const getViewRpcMap = (model, data) => {
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
};

/** getFormData
  return item's data object

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
*/

/** formSubmit
  return false
*/



