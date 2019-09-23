// src/clinic/model/moCards.js

import { vuDialog } from '../../apps/view/vuDialog.js';
import { restSprav } from '../../sprav/spravApi.js';
import { restClinic } from '../clinicApi.js';
import { moModel, errMsg, _schema, _region } from '../../apps/model/moModel.js';

export const moCardsList = {
  // return model object 
  getModel() {
    const model = {
      url: restClinic.card_find.url,
      method: restClinic.card_find.method,
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
    let c= { crd_num: String(crd) };
    //console.log(crd);
    return moModel.getViewRpcMap(
      model, [c, c]
    );
  },
  
  saveCard(event, card, model, method) {
    event.target.parentNode.classList.add('disable');
    let { crd_num } = model.card[0];
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
    */
    let schema = _schema('pg_rest');
    //let method = event.target.getAttribute('method');
    let { _crd_num, id } = card;
    let table = `${schema}cardz_clin`;
    let url = id ? `${table}?id=eq.${id}`: table;
    ['id', 'created', 'modified', 'cuser'].forEach( k=> delete to_save[k] );
    if ( method === 'PATCH' && (crd_num == _crd_num) )
      // same card number 
      delete to_save.crd_num; // primary key duplication
    // else change card number
    return m.request({
      url: url,
      method: method,
      body: to_save
    }).then( res => {
      event.target.parentNode.classList.remove('disable');
      return true;
    }).catch( err => {
      model.save = errMsg(err);
      event.target.parentNode.classList.remove('disable');
      vuDialog.open();
    });
  }
};
