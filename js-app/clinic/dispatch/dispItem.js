
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


const error = (unit, item) => {
  return { 
    card: `Карта ${item} не найдена`,
    templ: `Шаблон ${item} не найден`
  }[unit];
};

export const dispItem = function () {

  this._item = () => {
    let card = this.state().card,
      talon = this.state().talon,
      unit = this.state().unit;
    let item = card || talon;
    
    if (item === '') {
      this.stup({data: new Map()});
      listItem({});
      itemId('');
      return `new ${unit}`;
    }
    
    // get card number from this stream initailly
    changedItem({ crd_num: card, tal_num: talon });
    return getData(this.state().suite, unit, 'data')
      .then(res => {
        this.stup(res);// card and list of talons in Map to state.data
        
        let data = this.state().data.get(unit)[0] || {};
        
        if (R.isNil(data) || R.isEmpty(data))
          return Promise.reject({ error: error(unit, item)});
         
        // init changedItem
        listItem(data); // item object from Map
        itemId(item.toString());
        
        return `${unit} loaded`; // just string
      });
  };
    
  this._saved_item = d => {
    let [res] = d,
      { crd_num='', tal_num=''} = res[0], //.crd_num;
      item = crd_num || tal_num;
    
    this.stup({ card: crd_num, talon: tal_num });
    listItem(res[0]);
    // update changedItem
    itemId(item);
    return false;
  };

};
