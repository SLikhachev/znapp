// src/apps/model/moTalons.js

import {restClinic } from '../clinicApi.js';
import { moModel } from '../../apps/model/moModel.js';

const moTalonsList = {
  
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
    if ( data.q_crd == "" && (data.q_date != "" || data.q_dcod != "" ) )
      data.q_crd = ".*";
    if (data.q_date == "" && data.q_dcod != "")
      data.q_date = '2010-01-01';
    data.q_date = data.q_date == "" ? null : data.q_date;
    if (data.q_dcod == "")
      data.q_dcod = null;
    data.lim = 50;
    data.offs = 0;
    
    
    moModel.getViewRpc(
      moTalonsList.getModel(),
      data
    );
    //m.redraw();
    return false;
  }
  
};

const moTalon = {
  
  model : {
    url: restClinic.get_talon.url,
    method: restClinic.get_talon.method,
    list: null, 
    error: null
  },
  
  getModel() {
    return this.model;
  },
  
  getTalon(args) {
    return moModel.getViewRpc(
      moTalon.getModel(),
      { talon_num: args.id }
    );
  }
  
};

export { moTalonsList, moTalon };
