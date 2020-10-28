
'use strict';

import { getData } from '../../apps/model/moData';
import {
  listItem,
  itemId,
  changedItem,
} from '../../apps/model/moListItem';
import { initTempl } from '../model/moTalons';


const error = (unit, item) => {
  return {
    card: `Карта ${item} не найдена`,
    templ: `Шаблон ${item} не найден`
  }[unit];
};

const E = () => ({});

const initItem = item => {
  return {
    templ: initTempl
  }[item] || E;
};


export const dispItem = function () {

  this._item = () => {
    let card = this.state().card,
      talon = this.state().talon,
      unit = this.state().unit;
    let item = card || talon;

    if (item === '') {
      this.stup({ data: new Map() });
      listItem(initItem(unit)());
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
          return Promise.reject({ error: error(unit, item) });

        // init changedItem
        listItem(data); // item object from Map
        itemId(item.toString());

        return `${unit} loaded`; // just string
      });
  };

  this._saved_item = d => {
    let [res] = d, item = res && res[0] ? res[0] : {};

    if (R.isEmpty(item))
      return false;

    let { crd_num = '', tal_num = '' } = item,
      pk = crd_num || tal_num;


    if (!!crd_num)
      this.stup({ card: crd_num });
    if (!!tal_num)
      this.stup({ talon: tal_num });

    listItem(res[0]);
    // update changedItem
    itemId(pk);
    return false;
  };

};
