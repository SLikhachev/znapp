// src/apps/model/moTalons.js

import { restSprav } from '../../sprav/spravApi.js';
import { restClinic } from '../clinicApi.js';
import { moModel, errMsg } from '../../apps/model/moModel.js';

export const moTalonsList = {
  // :: Object
  // return model object (POJO)
  getModel() {
    const model = {
      url: restClinic.talon_find.url,
      method: restClinic.talon_find.method,
      list: null, // main data list (showing in table page)
      error: null, // Promise all error
      order: true, // for list
      sort: null // for list
    };
    return model;
  },
  
};

export const talonOpt= {
  options: [ restSprav.doctor ],
  data: new Map(),
  error: null,
  getOptions() {
    if (this.data && this.data.size && this.data.size !== 0) return;
    moModel.getData( talonOpt );
  }
}

export const moTalon = {
  
  getModel() {
    const model= {
      url: [restClinic.get_talon.url, restClinic.get_pmu.url],
      method: [restClinic.get_talon.method,  restClinic.get_pmu.method],
      map_keys: ['talon', 'pmu'],
      talon: null,
      card: null,
      pmu: null,
      tosave: null,
      error: null,
      save: null
    };
    return model;
  },
  
  getTalon(model, card, talon) {
    let tal= parseInt(talon), crd = parseInt(card);
    if ( !isNaN(tal) && tal !== 0) {
      let t= { tal_num: tal };
      // exisiting talon? card will be fetched within talon record
      return moModel.getViewRpcMap(
        model, [ t, t ]
      ).then( t => moTalon.prepare( model )  );//.catch(e => alert(e));
    }
    // get card only to new talon
    let pg_rest = window.localStorage.getItem('pg_rest');
    let url = `${pg_rest}cardz_clin?crd_num=eq.${crd}`;
    return m.request({
      method: 'GET',
      url: url
    }).then(function(res) {
      // there are no talon and pmu keys
      model.card = res; // res is list
      moTalon.prepare( model ); 
    }).catch(function(err) {
      model.error = errMsg(err);
    });
  },
  
  // delete from talon cards fields
  to_talon(data, fields) {
    let t = {};
    Object.keys(data).map( k => {
      if (fields.indexOf(k) < 0) t[k] = data[k];
    });
    t.crd_num = data.crd_num;
    return t;
  },
  
  prepare( model ) {
   const card_fileds = [
    'id', 'crd_num', 'fam', 'im', 'ot', 'birth_date',
    'polis_ser', 'polis_num', 'smo',
    'dul_serial', 'dul_number',
    'mo_att' ];
    // prepare card
    let card = model.card ? model.card[0] : model.talon[0];
    let c = {};
    for (let f of card_fileds) {
      c[f] = card[f];
    }
    model.card= c; // rewrites and this is not a list
    // prepare talon
    model.talon= model.talon ? moTalon.to_talon(model.talon[0], card_fileds) : {};
    if (model.pmu === null)  model.pmu=[];
  },
  
  saveTalon(event, model, method) {
    //console.log(event);
    event.target.parentNode.classList.add('disable');
    let tal= Object.assign({}, model.talon);
    let pg_rest = window.localStorage.getItem('pg_rest');
    let { tal_num } = tal;
    let url=`${pg_rest}talonz_clin`;
    if ( Boolean(tal_num) ) {
      url += `?tal_num=eq.${tal_num}`;
      delete tal.tal_num;
    }
    m.request({
      url: url,
      method: method,
      data: tal
    }).then( res => {
      event.target.parentNode.classList.remove('disable');
    }).catch( err => {
      model.save = { err: true, msg: errMsg(err) };
      event.target.parentNode.classList.remove('disable');
    });
    return false;
  }
};


