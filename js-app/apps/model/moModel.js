// src/apps/model/moModel.js

import { schemaRest } from '../apiConf.js';
import { vuDialog } from '../view/vuDialog.js';

const schema = schemaRest;

const moModel = {
  
  // :: String -> Array -> String -> Object
  // ret models object (POJO)
  getModel( {url=null, method="GET", options=null, sort_by=null, editable=false } = {} ) {
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
      editable: editable,
      
      list: null, // main data list (showing in table page)
      data: {}, // every idx corresponds with index of options array
      
      error: null, // Promise all error
      order: true, // for list
      sort: null // for list
    };  
    model.sort = function(field) {
      return moModel.sort(model, field);
    };  
    //console.log(model);
    return model;
  },
  // :: Object -> Promise
  // ret Promise
  getList (model) {
    // filed - sort by with SELECT, default 'id' field
    let id = model.field ? model.field : 'id',
    order = `?order=${id}.asc`;
    return m.request({
      method: model.method,
      url: schema + model.url + order
    }).then(function(res) {
      model.list = res; // list of objects
      model.order = true;
    }).catch(function(e) {
      model.error = e.message;
      console.log(model.error);
    });
  },
  // :: Object -> undef
  // return Promise all
  getData(model){
    if ( model.options === null ) return false;
    let data = [],
    order = '?order=id.asc';
    model.options.forEach ( (t) => {
      let r = m.request({
        method: t.method ? t.method : "GET" ,
        url: schema + t.url + order
      });
      data.push(r);
    });
    // order should preserved
    Promise.all(data).then( (lists) => {
      model.data = _.zipObject( model.options, lists);
      //console.log( model.list );
    }).catch(function(e) {
      //model.error = e.message;
      console.log(e.message);
    });
    
  },
  
  // :: Object -> String -> String -> Object -> Promise
  // return Promise
  getViewRpc (model, data, url=null, method=null) {
    let _url = url ? url : model.url;
    let _method = method ? method : model.method;
    return m.request({
      method: _method,
      data: data,
      url: schema + _url
    }).then(function(res) {
      model.list = res; // list of objects
      model.order = true;
    }).catch(function(e) {
      model.error = e.message;
      console.log(model.error);
    });
  },
  
  sort(model, id=null) {
    console.log(id);
    let order = model.order ? 'desc' : 'asc';
    let field = id ? id : 'id'; 
    model.list = _.orderBy(model.list, [ field ], [ order ]);
    model.order = !model.order;
  },
  
  /** getFormData
    return item's data object 
  */
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
  
  /** formSubmit
    return false    
  */
  formSubmit (model, form) {  
    // form - jQuery object
    // model - model object 
    let data = moModel.getFormData( form ),
    url = schema + model.url,
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

};

export { moModel };
