// src/clinic/model/moCards.js

//import { schemaRest } from '../../apps/apiConf.js';
import { restSprav } from '../../sprav/spravApi.js';
import { restClinic } from '../clinicApi.js';
import { moModel } from '../../apps/model/moModel.js';

//let schema = schemaRest;

const moCardsList = {
  
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

const moCard = {
  
  model : {
    url: restClinic.get_card.url,
    method: restClinic.get_card.method,
    list: null, 
    opt_name: 'card_options',
    options: [restSprav.dul, restSprav.smo_local],
    data: null, 
    error: null
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
  }
  
};

export { moCardsList, moCard };
