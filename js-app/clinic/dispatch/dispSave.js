
'use strict';


import { checkArray } from '../../apps/utils';
import { changedItem, saveItem } from '../../apps/model/moListItem';
import { vuDialog } from '../../apps/view/vuDialog';
import { toSaveTalon } from '../model/moTalons';


const patch = ['PATCH', "Изменить"];
const post = ['POST', "Добавить"];


export const dispSave = function () {

  this.method = () => {
    let { unit, card, talon } = this.state(),
      [method, word] = patch;

    let _newcard = unit === 'card' && !card;
    let _newtalon_templ = (unit === 'talon' || unit === 'templ') &&
      !talon;

    if (_newcard || _newtalon_templ)
      [method, word] = post;

    this.stup({ method, word });
    return method;
  };

  this._saved = item => ({
    card: this._saved_item,
    templ: this._saved_item,
    talon: this._saved_talon,
    pmu: this._saved_pmu,
  }[item] || this.F
  );

  this.save_items = d => {
    let [item, event, method, data, after_save = null] = d;

    event.target.classList.add('disable');

    return saveItem(this.state().suite[item], 'item', method, data)
      //return representation then change current list item 
      .then(resp => {
        let res = checkArray(resp) ? resp : [];
        if (!!after_save && typeof after_save === 'function')
          return after_save([res]);
        if (!R.isEmpty(res) && res[0])
          return this._saved(item)([res]);
        return false;
      })
      .catch(error => {
        if (!!error && !!error.saverror) {
          vuDialog.error = error.saverror;
          vuDialog.open();
        }
        //console.error('catch in save_items', error);
      })
      .finally(() => event.target.classList.remove('disable'));
  };

  this.save = d => {
    let [item, event, method = ''] = d;

    method = method || this.method();

    vuDialog.error = '';
    this.stup({
      errorsList: this.state().suite[item].item.validator(changedItem)
    });

    if (!R.isEmpty(this.state().errorsList)) {
      vuDialog.open();
      return false;
    }

    // save card from changedItem() if data is null
    // else from data object
    let data = null;

    // save talonTalon from data object;
    if (this.state().unit === 'talon' && item === 'talon')
      data = toSaveTalon(); // save talon form

    // save all others from changedItem, 
    // fields to save rules by 'editable_fields': array of the item
    return this.save_items([item, event, method, data]);
  };
};

