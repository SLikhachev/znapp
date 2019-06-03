// src/apps/model/moTalons.js

import {restClinic } from '../clinicApi.js';
import { moModel } from '../../apps/model/moModel.js';

export const moTalonsList = {
  
  model : {
    url: restClinic.talon_find.url,
    method: restClinic.talon_find.method,
    list: null, // main data list (showing in table page)
    error: null, // Promise all error
    order: true, // for list
    sort: null // for list
  },
  
  // :: Object
  // return model object (POJO)
  getModel() {
    return moTalonsList.model;
  },
  
  talonsFind(event) { 
    // button FIND click event handler callback 
    event.preventDefault();
    let data = moModel.getFormData( $('form#talon_find') );
    //console.log ( data );
    //moTalonsList.model.list=[];
    //return false;
    if (data.q_tal == "")
      data.q_tal = 1;
    if ( data.q_crd == "" && (data.q_date != "" || data.q_dspec != "" ) )
      data.q_crd = ".*";
    if (data.q_date == "" && data.q_dspec != "")
      data.q_date = '2010-01-01';
    data.q_date = data.q_date == "" ? null : data.q_date;
    if (data.q_dspec == "")
      data.q_dspec = null;
    data.lim = 50;
    data.offs = 0;
    //console.log ( data );
    
    moModel.getViewRpc(
      moTalonsList.getModel(),
      data
    );
    //m.redraw();
    return false;
  }
  
};

export const moTalon = {
  
  model : {
    url: restClinic.get_talon.url,
    method: restClinic.get_talon.method,
    //card: null,
    list: null, 
    opt_name: 'talon_options',
    options: [], //[restSprav.dul, restSprav.smo_local, restSprav.mo_local, restSprav.okato],
    data: null, 
    error: null,
    save: null
  },
 
  getModel() {
    return this.model;
  },
  
  getTalon(args) {
    return moModel.getViewRpc(
      moTalon.getModel(),
      { tal_num: args.id }
    );
  },
  
  getOptions() {
    if (this.model.data && this.model.data.size && this.model.data.size !== 0) return;
    moModel.getData( this.model );
  },
  
};

