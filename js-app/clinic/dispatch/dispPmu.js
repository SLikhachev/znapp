
'use strict';

// src/report/reportApi.js
/**
  */

import { changedItem } from '../../apps/model/moListItem';
import { vuDialog } from '../../apps/view/vuDialog';
import { 
  is_code_field,
  find_in_opts,
  find_in_data,
  prep_to_save_pmus,
  add_pmus,
  incr_usl, 
  decr_usl
} from '../model/moPmu';


export const dispPmu = function () {

  this.save_pmu = d => {
    let [field, event] = d;
    
    // pmu present im memory
    if ( is_code_field(field) ) {
      
      // this pmu is already in talon
      if (!R.isEmpty( find_in_data(
          'tal_pmu', field, changedItem()[field]
         ) ) ) return false;
      
      // get it from prefetch if any
      let pmus =  [find_in_opts(
          'code_usl', field, changedItem()[field]
        )], 
        pmu$ = prep_to_save_pmus(pmus);
      
      if (!R.isEmpty( pmu$ )) {
        let error = pmu$[0].error;
        if (error) {
          this.state().options.set('pmu', [{ error: `red&${error}`}]);
          return false;
        }
        this.state().options.set('pmu', [...pmus]);
        return this.save_items(['pmu', event, 'POST', [...pmu$]]);
      }
    }
    // else get it from api call
    //state().options.set('pmu', []); // ?? or stup
    vuDialog.error = '';
    this.stup({ errorsList: [] });
    let option = { code_usl: 'pmu', ccode: 'pmu', grup: 'pmu_grup' };
    return this.fetch_toOptions(
      [option[field], 'pmu', '', add_pmus(field, event)]
    );
  };

  this.set_pmu = d => {
    let [pmu] = d;
    this.state().options.set('pmu', pmu);
  };

  this._tal_pmu = d => {
    let [action, id, kol_usl] = d, 
      pmu = action === 'inc' ? incr_usl(id, kol_usl) : decr_usl(id, kol_usl);
    console.log('_tal_pmu', action, id, kol_usl, pmu );
    this.state().data.set('tal_pmu', [...pmu]);
  };

  this.pmu_kol_usl = d => {
    let [action, event] = d,
      id = event.target.getAttribute('data-id'),
      kol = Number(event.target.getAttribute('data-kol')),
      kol_usl = action === 'dec' ? kol - 1 : kol + 1,
      method = kol_usl === 0 ? 'DELETE' : 'PATCH',
      data = { id };
    if (method === 'PATCH')
      data = Object.assign(data, { kol_usl });
    else 
      data = Object.assign(data, { method });
    
    return this.save_items([
      'pmu', event, method, data,
      () => this._tal_pmu([action, id, kol_usl])
    ]);
  };

  this._saved_pmu = d => {
    let [res] = d,
      old_pmus = this.state().data.get('tal_pmu'),
      new_pmus = res.map( r => Object.assign(
        find_in_opts('pmu', 'code_usl', r.code_usl), r
      ));
    // update_pmus
    this.state().data.set('tal_pmu', [...old_pmus, ...new_pmus]);
    return false;
  };

};
