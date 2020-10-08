
'use strict';

// src/report/reportApi.js
/**
  */
import { getData } from '../../apps/model/moData';
import { 
  listItem, 
  itemId, 
  changedItem, 
} from '../../apps/model/moListItem';
import { cardTabs } from '../view/vuClinic';


const patch = ['PATCH', "Изменить"];
const post = ['POST', "Добавить"];


export const dispCard = function () {

  this._card = d => {
    let [suite, args] = d, 
      { card } = args, 
      [method, word] = patch;
      
      // new card
    if (card === 'add') {
      card= '';
      [method, word]  = post;
    }  

    this.stup({
      suite,
      unit: 'card', card, data: null, method, word,
      error: '', errorsList: [],
      tabs: cardTabs,
    });
      
    if (card === '') {
      this.stup({data: new Map()});
      listItem({});
      itemId(card.toString());
      return Promise.resolve('new card');
    }
      
    // get card number from this stream initailly
    changedItem({ crd_num: card });
    return getData(this.state().suite, 'card', 'data')
      .then(res => {
        this.stup(res);// card and list of talons in Map to state.data
        
        let _card = this.state().data.get('card')[0] || {};
        
        if (R.isNil(_card) || R.isEmpty(_card))
          this.stup({ error: 'Карта не найдена'});
        
        // init changedItem
        listItem(_card); // card object from Map
        itemId(card.toString());
        
        return 'card loaded'; // just string
      });
  };
    
  this._saved_card = d => {
    let [res] = d;
    if (this.state().unit === 'card') {
      // update from response
      let card = res[0].crd_num;
      this.stup({ card });
      listItem(res[0]);
      // update changedItem
      itemId(card);
    }
    return false;
  };

};
