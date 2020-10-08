
'use strict';

// src/report/reportApi.js
/**
  */
import { getData } from '../../apps/model/moData';
import { getList } from '../../apps/model/moList';
import { 
  listItem, 
  itemId, 
  changedItem, 
} from '../../apps/model/moListItem';
import { talonPath, talons } from '../defines/defTalons';
import { initTalon } from '../model/moTalons';
import { talonTabs } from '../view/vuClinic';


const patch = ['PATCH', "Изменить"];
const post = ['POST', "Добавить"];


export const dispTalon = function () {

  this._talon = d => {
    let [suite, args] = d, 
      [method, word] = patch,
      { card, talon } = args;

    if (talon === 'add') {
      talon= '';
      [method, word]  = post;
    } 

    this.stup({
      suite,
      unit: 'talon', card, talon, data: null, //options: new Map(),
      method, word, error: '', errorsList: [],
      tabs: talonTabs, 
    });
   
    changedItem({ crd_num: card, _tal: talon });

    // get talon and pmus NaN and ZERO Numbers are ignored
    if (!!talon) {
      return getData(this.state().suite, 'talon', 'data')
      .then(res => {
        this.stup(res);// talon and list of pmus in Map to state.data

        let _talon = this.state().data.get('talon')[0] || {};
        
        if (R.isNil(_talon) || R.isEmpty(_talon))
          this.stup({ error: 'Талон не найден'});
        
        // init changedItem
        listItem( initTalon(_talon) ); // talon object from Map
        itemId(talon.toString());
        
        return 'talon and pmus loaded'; // just string
      });
    }

    // else just get card only
    return getList(this.state().suite, 'card')
      .then(
        res => {
          if (R.isEmpty(res.list)) {
            this.stup({ error: 'Карта не найдена'});
          } else {
            this.stup({ data: new Map()});
            listItem( initTalon({}, res.list[0]) ); // card object from Map
            itemId('add'); // just string no talon number
            this.state().data.set('card', res.list[0]);
          }
          return 'talon card loaded';
      });
  };

  this._saved_talon = d => {
    let [res] = d;
    if (this.state().talon === '')
      // redirect to just added talon
      m.route.set(talonPath(res[0].crd_num, res[0].tal_num));
    // else nothing todo
    return false;
  };
};

