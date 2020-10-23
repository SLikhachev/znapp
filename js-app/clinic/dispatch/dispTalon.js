
'use strict';

// src/report/reportApi.js
/**
  */
import { genId } from '../../apps/utils';
import { getData } from '../../apps/model/moData';
import { getList } from '../../apps/model/moList';
import { 
  listItem, 
  itemId, 
  changedItem,
  changeValue,
  target
} from '../../apps/model/moListItem';
import { vuDialog } from '../../apps/view/vuDialog';
import { $path } from '../defines/defClinic';
import { talonPath, talons } from '../defines/defTalons';
import { tpl_to_save } from '../defines/defTempls';
import { initTalon } from '../model/moTalons';
import { talonTabs } from '../view/vuClinic';


export const dispTalon = function () {

  this._talon = () => {
    let card = this.state().card, 
      talon = this.state().talon;
    
    if (!card)
      return Promise.reject(
        { error: `Для талона "${talon}" не указана карта`}
      );
    
    changedItem({ crd_num: card, _tal: talon });

    // get talon and pmus NaN and ZERO Numbers are ignored
    if (!!talon) {
      return getData(this.state().suite, 'talon', 'data')
      .then(res => {
        this.stup(res);// talon and list of pmus in Map to state.data

        let _talon = this.state().data.get('talon')[0] || {};
        
        if (R.isNil(_talon) || R.isEmpty(_talon) || !_talon.talon_type)
          return Promise.reject({ error: `Талон "${talon}" не найден`});
        
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
          if (R.isEmpty(res.list))
            return Promise.reject({ 
              error: `Карта "${card}" для нового талона не найдена`}
            );
          
          this.stup({ data: new Map()});
          listItem( initTalon({}, res.list[0]) ); // card object from Map
          itemId('add'); // just string no talon number
          this.state().data.set('card', res.list[0]);
          return 'card for new talon loaded';
      });
  };

  this._saved_talon = d => {
    let [res] = d;
    if (this.state().talon === '')
      // redirect to just added talon
      m.route.set(talonPath(res[0].crd_num, res[0].tal_num));
    // else nothing todo
    return res[0];
  };
  
  this.apply_tpl = d => {
    let [ tal_num ] = d;
    
    if (!tal_num)
      return false;
    
    let tpl = this.state().options.get('templs').find(
        t => t.tal_num == tal_num
      );
    
    if (!tpl) {
      this.stup({ errorsList: [`Нет шаблона №${tal_num}`] });
      vuDialog.open();
      return false;
    }
    changedItem(
      tpl_to_save.slice(2).reduce( (o, f) => R.assoc(f, tpl[f], o), changedItem())
    );
    return false;
  };

  this.confirm_code = prompt => {
    let conf = this.state().suite[this.state().unit].item || {}, 
      _prompt = conf.prompt || prompt, 
     code = conf.confirm && 
      typeof conf.confirm === 'function' && 
      conf.confirm() || genId(10); 
    console.log(code)
    return  window.prompt(_prompt) == code ?
      true :
      false;
  };

  this.confirm = text => window.confirm(text) ? true : false;

  this.change_talon_type = d => {
    let [talon_type, event] = d, 
      { tal_num } = changedItem(), change = false;
    
    if (!tal_num)
      return false;
    
    if (talon_type > 0)
      change = this.confirm("Ихменить тип талона");
    else 
      change = this.confirm_code('Ведите код подтверждения');
    
    return change ?  
      //let [item, event, method, data, after_save=null] = d;
      this.save_items([
        'talon', event, 'PATCH', { tal_num, talon_type }
      ]).
      then(talon => {
        if (!!talon.talon_type)
          changeValue(target('talon_type', talon.talon_type))
        else
          m.route.set($path.talons);
      }) :
      false;
  };
};

