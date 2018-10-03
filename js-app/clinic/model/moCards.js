// src/apps/model/moCards.js

//import { schemaRest } from '../../apps/apiConf.js';
import { restApi } from '../clinicApi.js';
import { moModel } from '../../apps/model/moModel.js';

//let schema = schemaRest;

const moCardsList = {
  
  model : {
    url: restApi.card_find.url,
    method: restApi.card_find.method,
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
    url: restApi.get_card.url,
    method: restApi.get_card.method,
    list: null, 
    error: null
  },
  
  getModel() {
    return this.model;
  },
  
  getCard(args) {
    return moModel.getViewRpc(
      moCard.getModel(),
      { crd_num: args.id }
    );
  }
  
};

export { moCardsList, moCard };
