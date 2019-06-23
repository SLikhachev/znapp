// src/apps/model/moModel.js

//import { schemaRest } from '../apiConf.js';
import { vuDialog } from '../view/vuDialog.js';

//const pg_rest = window.localStorage.getItem('pg_rest'); //postgest schemaRest;
//console.log(schema);

export const moModel = {
  
  // :: String -> Array -> String -> Object
  // ret models object (POJO)
  getModel( {url=null, method="GET", options=null, sort_by=null, editable=null } = {} ) {
    // url - string of model's REST url
    // method - string of model's REST method
    // options - array of strings of option tables names
    // need for form data select/option if any
    // field - string "sort by" with SELECT
    // editable = bool defines is model could changed
    let model = {
      url: url,
      method: method,
      field: sort_by,
      options: options,
      //editable: editable,
      
      list: null, // main data list (showing in table page)
      data: new Map(), // every idx corresponds with index of options array
      item: null,
      error: null, // Promise all error
      order: true, // for list
      sort: null, // for list
      save: null,
    };  
    if ( Boolean( editable ) && editable instanceof Array) {
      for (let [idx, val] of ['add', 'edit', 'del'].entries() ) {
        if (Boolean( editable[idx] )) model[val] = true;
      }
    }
    model.sort= field => moModel.sort(model, field);
    model.getItem= id => {
      model.item= {};
      if (id === null) return false; 
      for ( let it of model.list ) {
        if (it.id == id) {
          model.item= Object.assign({}, it);
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
  getList (model) {
    model.list= null;
    // filed - sort by with SELECT, default 'id' field
    //let schema = window.localStorage.getItem('pg_rest');
    let pg_rest = window.localStorage.getItem('pg_rest');
    let id = model.field ? model.field : 'id',
    sign= model.url.includes('?') ? '&': '?';
    order = `${sign}order=${id}.asc`;
    let url = pg_rest + model.url + order;
    console.log(url);
    return m.request({
      method: model.method,
      url: url
    }).then(function(res) {
      model.list = res; // list of objects
      model.order = true;
      return true;
    }).catch(function(e) {
      //console.log(e);
      let err = JSON.parse(e.message);
      model.error = err.message ? err.message : e.message;
      console.log( err );
    });
  },
  // :: Object -> undef
  // return Promise all
  getData(model){
    if ( model.options === null ) return false;
    //let schema = window.localStorage.getItem('pg_rest');
    let pg_rest = window.localStorage.getItem('pg_rest');
    let data = [],
    order = '?order=id.asc';
    model.options.forEach ( (t) => {
      let r = m.request({
        method: t.method ? t.method : "GET" ,
        url: pg_rest + t.url + order
      });
      data.push(r);
    });
    // order should preserved
    return Promise.all(data).then( (lists) => {
      model.data.clear(); // = new Map();
      for ( let el of model.options.entries() ) {
        model.data.set( el[1].url, lists[ el[0] ]);
      }
      //window.localStorage.setItem(model.opt_name, model.data);
      //model.data = _.zipObject( model.options, lists);
      //console.log( model.list );
    }).catch(function(e) {
      //model.error = e.message;
      console.log(e.message);
      alert(e.message);
    });
    
  },
  
  // :: Object -> String -> String -> Object -> Promise
  // return Promise
  getViewRpc (model, data, url=null, method=null) {
    //let schema = window.localStorage.getItem('pg_rest');
    let pg_rest = window.localStorage.getItem('pg_rest');
    let _url = url ? url : model.url;
    let _method = method ? method : model.method;
    return m.request({
      url: pg_rest + _url,
      method: _method,
      data: data,
      
    }).then(function(res) {
      model.list = res; // list of objects
      model.order = true;
    }).catch(function(e) {
      console.log(e);
      let err = JSON.parse(e.message);
      model.error = err.message ? err.message : e.message;
      console.log( err );
    });
  },

  getViewRpcMap (model, data) {
    let pg_rest = window.localStorage.getItem('pg_rest');
    let reqs = [];
    for (let [idx, url] of model.url.entries()) {
      let r = m.request({
        method: model.method[idx],
        url: pg_rest + url,
        data: data
      });
      reqs.push(r);
    }
    // order should preserved
    return Promise.all(reqs).then( (lists) => {
      // map data must be Map
      //model.map_data.clear(); // = new Map();
      for ( let [idx, key] of model.map_keys.entries() ) {
        //model.map_data.set( name, lists[ idx ]);
        model[key] = lists[idx];
      } 
      return true;
      return Promise.resolve(true);
    }).catch(function (e) {
      console.log(e);
      let err = JSON.parse(e.message);
      model.error = err.message ? err.message : e.message;
    });
  },

  sort(model, id=null) {
    //console.log(id);
    let order = model.order ? 'desc' : 'asc';
    let field = id ? id : 'id'; 
    model.list = _.orderBy(model.list, [ field ], [ order ]);
    model.order = !model.order;
  },
  
  /** getFormData
    return item's data object 
  */
  /*
  getFormData(form, isSetOnly=false) {
    // form - dom form
    // isSetOnly - set out only
    let data = {};
    //let da = [];
    let text  = $(':input', form);
    Array.from(text).forEach( ( el ) => {
      if ( !!el.name )
        data[ el.name ] = el.value;
    } );
    return data;
  },
  */
  /** formSubmit
    return false    
  */
  dialogFormSubmit(event, model, method) {
    event.target.parentNode.classList.add('disable');
    let pg_rest = window.localStorage.getItem('pg_rest');
    let url = pg_rest + model.url;
    if ( method == 'DELETE' || method == 'PATCH' )
      url += '?' + 'id=eq.' + model.item.id;
    let data= Object.assign({}, model.item);
    
    for ( let k of Object.keys(data) ){
      if ( data[k] === '' ) data[k] = null;
    }
    
    return m.request({
      url: url,
      method: method,
      data: data,
      async: false
    }).then( res => {
      model.save = { err: false, msg: res };
      event.target.parentNode.classList.remove('disable');
      moModel.getList( model );
      vuDialog.close();
    }).catch( err => {
      let e = JSON.parse(err.message);
      model.save = { err: true, msg: e.message ? e.message : err.message };
      event.target.parentNode.classList.remove('disable');
      //console.log(model.save);
    });
    
    return false;
  }
/*
  formSubmit (model, form) {  
    // form - jQuery object
    // model - model object 
    //let schema = window.localStorage.getItem('pg_rest');
    let pg_rest = window.localStorage.getItem('pg_rest');
    let data = moModel.getFormData( form ),
    url = pg_rest + model.url,
    method = data.method;
    //console.log ( data );
    //return false;
    vuDialog.form = form;
    delete data.method;
    if ( method == 'DELETE' || method == 'PATCH' )
      url += '?' + 'id=eq.' + data.id;
    $.ajax({
      url: url,
      type: method,
      async: false,
      data: data,
      //context: form,
      //contentType: 'application/json',
      dataType: 'json',
      beforeSend: vuDialog.offForm,
      error: vuDialog.xError,
      success: vuDialog.xSuccess
    });
    return false;
  }
*/
};


