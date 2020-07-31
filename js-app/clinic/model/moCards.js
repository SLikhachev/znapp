// src/clinic/model/moCards.js

import { disp, memost } from '../../apps/appApi';
//import { vuDialog } from '../../apps/view/vuDialog.js';
//import { moModel, errMsg, _schema, _region } from '../../apps/model/moModel.js';
import { _region } from '../../apps/model/moModel.js';
//import { restSprav } from '../../sprav/spravApi.js';
//import { restClinic } from '../clinicApi.js';
import { _just_int } from './moModel';

const _reg = _region();

const Reg = _region();

export const _getFIO = row => {
  let f = ['fam', 'im', 'ot'].map(k => row[k] ? row[k] : '');
  return `${f[0]} ${f[1]} ${f[2]}`;
};

export const _ufms = e => {
  memost('dul_org');
  let ufms = _just_int(e.target.value, 6);
  if (!!ufms)
    disp(['fetch_rest', 'ufms', 'name', 'dul_org']);
  return false;
};

//--------------------------

/*

export const moCardsList = {
  // return model object 
  getModel() {
    const model = {
      url: restClinic.card_find.url,
      method: restClinic.card_find.method,
      //headers: { 'Accept': 'application/json' },
      list: null, // main data list (showing in table page)
      error: null, // Promise all error
      order: true, // for list
      sort: null // for list
    };
    return model;
  },
  
  sort(model, id=null) {
    //console.log(id);
    let order = model.order ? 'desc' : 'asc';
    let field = id ? id : 'id'; 
    model.list = _.orderBy(model.list, [ field ], [ order ]);
    model.order = !model.order;
  },
  _table: 'cardz_clin',
  crdTable() {
    return `${moCardsList._table}`;
  },
};

const testCase = function(time, test) {
  return new Promise( (res, rej) => {
    setTimeout( () => {
      if (test) res("Test passed");
      else rej("Test not passed");
    }, time);
  });
}

export const cardOpt= {
  options: [restSprav.dul, restSprav.smo_local, restSprav.mo_local, restSprav.okato],
  data: new Map(),
  error: null,
  getOptions() {
    if (this.data && this.data.size && this.data.size !== 0) return;
    moModel.getData( cardOpt );
  }
}

export const moCard = {

  getModel() {
    const model= {
      url: [restClinic.get_card.url, restClinic.get_crd_talons.url],
      method: [restClinic.get_card.method, restClinic.get_crd_talons.method],
      map_keys: ['card', 'talons'],
      //map_data: new Map(),
      card: null,
      talons: null,
      error: null,
      save: null
    };
    return model;
  },
  
  getCard(model, crd) {
    let c= { _tbl: moCardsList.crdTable(), crd_num: String(crd) };
    let t= { tal_tbl: moTalonsList.talTable(), crd_num: String(crd) };
    //console.log(crd);
    return moModel.getViewRpcMap(
      model, [c, t]
    );
  },
  
  saveCard(event, card, model, method) {
    //event.preventDefault();
    event.target.parentNode.classList.add('disable');
    //let { crd_num } = model.card[0];
    //model.card = Object.assign(model.card, card);
    const to_save= Object.assign({}, card);
    //console.log(moCard.model.card);
    /*
    testCase(2000, true).then( (res) => {
      //console.log('ggg ', res);
      moCard.model.save = { ok: true,  msg: res};
      //console.log(moCard.model.save);
      event.target.parentNode.classList.remove('disable');
      m.redraw();
    }).catch( e => {
       moCard.model.save = { ok: false, msg: e };
       event.target.parentNode.classList.remove('disable');
        m.redraw();
    });
    *//*
    let schema = _schema('pg_rest');
    //let method = event.target.getAttribute('method');
    let { crd_num, id, old_card } = card;
    let table = `${schema}cardz_clin`;
    let url = id ? `${table}?id=eq.${id}`: table;
    ['id', 'created', 'modified', 'cuser', 'ufms'].forEach( k=> delete to_save[k] );
    if ( method === 'PATCH' && (crd_num == old_card) )
      // same card number 
      delete to_save.crd_num; // primary key duplication
    // else change card number
    delete to_save.old_card; // no that field in table
    //to_save.smo = parseInt(to_save.smo) + _reg;
    return m.request({
      url: url,
      method: method,
      body: to_save
    }).then( res => {
      //console.log(card.crd_num);
      event.target.parentNode.classList.remove('disable');
      return true;
    }).catch( err => {
      //model.save = errMsg(err);
      event.target.parentNode.classList.remove('disable');
      throw ( errMsg (err) );
      //vuDialog.open();
    });
  }
};
*/