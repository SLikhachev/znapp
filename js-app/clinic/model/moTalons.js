// src/apps/model/moTalons.js

import { restClinic } from '../clinicApi.js';
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
    if (data.q_tal === "")
      data.q_tal = 1;
    if ( data.q_crd === "" && (data.q_date !== "" || data.q_dspec !== "" ) )
      data.q_crd = ".*";
    if (data.q_date === "" && data.q_dspec !== "")
      data.q_date = '2010-01-01';
    data.q_date = data.q_date === "" ? null : data.q_date;
    if (data.q_dspec === "")
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
    url: [restClinic.get_talon.url, restClinic.get_pmu.url],
    method: [restClinic.get_talon.method,  restClinic.get_pmu.method],
    map_keys: ['talon', 'pmu'],
    talon: null,
    card: null,
    pmu: null,
    tosave: null,
    opt_name: 'talon_options',
    options: [], //[restSprav.dul, restSprav.smo_local, restSprav.mo_local, restSprav.okato],
    data: new Map(),
    error: null,
    save: null
  },
 
  getModel() {
    return this.model;
  },
  
  getTalon(args) {
    let tal= parseInt(args.tal), crd = parseInt(args.crd);
    if ( !isNaN(tal) && tal !== 0)
      // exisiting talon? card will be fetched within talon record
      return moModel.getViewRpcMap(
        moTalon.getModel(),
        { tal_num: tal }
      ).then( (t) => moTalon.prepare(t) );//.catch(e => alert(e));
    
    // get card only to new talon
    let pg_rest = window.localStorage.getItem('pg_rest');
    let url = `${pg_rest}cardz_clin?crd_num=eq.${crd}`;
    return m.request({
      method: 'GET',
      url: url
    }).then(function(res) {
      // there are no talon and pmu keys
      moTalon.model.card = res; // res is list
      moTalon.prepare(true); 
    }).catch(function(e) {
      model.error = e.message.message ? e.message.message : e.message;
      alert(model.error);
    });
  },
  
  getOptions() {
    if (this.model.data && this.model.data.size && this.model.data.size !== 0) return;
    moModel.getData( this.model );
  },

  to_talon(data, fields) {
    let t = {};
    Object.keys(data).map( k => {
      if (fields.indexOf(k) < 0) t[k] = data[k];
    });
    t.crd_num = data.crd_num;
    return t;
  },
  
  prepare(t) {
   const card_fileds = [
    'id', 'crd_num', 'fam', 'im', 'ot', 'birth_date',
    'polis_ser', 'polis_num', 'smo',
    'dul_serial', 'dul_number',
    'mo_att' ];
    //let m = this.model;
    // prepare card
    let card = this.model.card ? this.model.card[0] : this.model.talon[0];
    let c = {};
    for (let f of card_fileds) {
      c[f] = card[f];
    }
    this.model.card= c; // rewrites and this is not a list
    // prepare talon
    this.model.talon = this.model.talon ? moTalon.to_talon(this.model.talon[0], card_fileds) : {};
  },
  
  clear() {
    this.model.card= null;
    this.model.talon= null;
    this.model.pmu= null;
  },
  
  setTalon(talon) {
    //console.log(card);
    moTalon.model.tosave = Object.assign({}, talon);
    //console.log(moTalon.model.tosave);
    return true;
  },
  
  save(event) {
    //console.log(event);
    event.preventDefault();
    event.target.parentNode.classList.add('disable');
    let pg_rest = window.localStorage.getItem('pg_rest');
    let method = event.target.getAttribute('method');
    let { tal_num } = moTalon.model.tosave;
    let table = `${pg_rest}talonz_clin`;
    let url = tal_num ? `${table}?tal_num=eq.${tal_num}`: table; 
    if ( Boolean(tal_num) ) delete moTalon.model.tosave.tal_num;
    
    m.request({
      url: url,
      method: method,
      data: moTalon.model.tosave
    }).then( res => {
      moTalon.model.save = { ok: false, msg: res };
      event.target.parentNode.classList.remove('disable');
    }).catch( err => {
      let e = JSON.parse(err.message);
      moTalon.model.save = { ok: false, msg: e.message ? e.message : err.message };
      event.target.parentNode.classList.remove('disable');
    });
    return false;
  }
};


