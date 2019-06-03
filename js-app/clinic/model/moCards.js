// src/clinic/model/moCards.js

//import { schemaRest } from '../../apps/apiConf.js';
import { restSprav } from '../../sprav/spravApi.js';
import { restClinic } from '../clinicApi.js';
import { moModel } from '../../apps/model/moModel.js';

//let schema = schemaRest;

export const moCardsList = {
  
  model : {
    url: restClinic.card_find.url,
    method: restClinic.card_find.method,
    list: null, // main data list (showing in table page)
    error: null, // Promise all error
    order: true, // for list
    sort: null // for list
  },
  
  // :: Object
  // return model object (POJO)
  getModel() {
    return moCardsList.model;
  },
  
  sort(model, id=null) {
    //console.log(id);
    let order = model.order ? 'desc' : 'asc';
    let field = id ? id : 'id'; 
    model.list = _.orderBy(model.list, [ field ], [ order ]);
    model.order = !model.order;
  },
    
  cardsFind(event) {  
    // button FIND click event handler callback 
    event.preventDefault();
    let data = moModel.getFormData( $('form#card_find') );
    //console.log ( data );
    //return false;
    data.lim = 50;
    data.offs = 1;
    moModel.getViewRpc(
      moCardsList.getModel(),
      data
    );
    //m.redraw();
    return false;
  }
  
};

const testCase = function(time, test) {
  return new Promise( (res, rej) => {
    setTimeout( () => {
      if (test) res("Test passed");
      else rej("Test not passed");
    }, time);
  })
}

export const moCard = {
  
  model : {
    url: restClinic.get_card.url,
    method: restClinic.get_card.method,
    card: null,
    list: null,
    opt_name: 'card_options',
    options: [restSprav.dul, restSprav.smo_local, restSprav.mo_local, restSprav.okato],
    data: null, 
    error: null,
    save: null
  },
  
  getModel() {
    return this.model;
  },
  
  getOptions() {
    if (this.model.data && this.model.data.size && this.model.data.size !== 0) return;
    moModel.getData( this.model );
  },
  
  getCard(args) {
    return moModel.getViewRpc(
      moCard.getModel(),
      { crd_num: args.id }
    );
  },
  /*
  actions(update) {
    return {
      get(data) {
        let d = moCard.getCard(data);
        d.then( (res) => update(Object.assign({}, { card: res[0]} ) ) ).catch( (e) =>{
            let err = JSON.parse(e.message);
            let msg = err.message ? err.message : e.message;
            update( Object.assign({}, { error:msg} ) );
          }
        );
      },
      set(data) { update( Object.assign({}, data) ); },
      change(data) { update(data); },
      clear(data) { update( Object.assign(data, {card: null, list: null, error: null, save: null}) ); }
    }
  },
  */
  setCard(card) {
    //console.log(card);
    moCard.model.card = Object.assign({}, card);
    //console.log(moCard.model.card);
    return true;
  },
  
  clear() {
    this.model.card = null;
    this.model.list = null;
    this.model.error = null;
    this.model.save = null;
    //console.log(this.model);
  },
  
  save(event) {
    event.preventDefault();
    event.target.parentNode.classList.add('disable');
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
    let pg_rest = window.localStorage.getItem('pg_rest');
    let method = event.target.getAttribute('method');
    let { id } = moCard.model.card;
    let table = `${pg_rest}cardz_clin`;
    let url = id ? `${table}?id=eq.${id}`: table; 
    if ( Boolean(id) ) delete moCard.model.card.id;
    
    m.request({
      url: url,
      method: method,
      data: moCard.model.card
    }).then( res => {
      moCard.model.save = { ok: false, msg: res };
      event.target.parentNode.classList.remove('disable');
    }).catch( err => {
      let e = JSON.parse(err.message);
      moCard.model.save = { ok: false, msg: e.message ? e.message : err.message };
      event.target.parentNode.classList.remove('disable');
    });
    return false;
  }
};
/*
export const appCard = {
  initalalState: Object.assign({}, moCard.model.card),
  actions(update) => Object.assign({}, moCard.actions(update) ) 
}

export const updateCrad = m.stream();
export const statesCard = m.stream().scan(Object.assign, appCard.initialState, update);
export const actionsCard = appCard.actions(update);
*/
/*
states.map(function(state) {
  m.request;
});
*/