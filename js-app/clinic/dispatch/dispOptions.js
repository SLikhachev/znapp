
'use strict';

import { getList } from '../../apps/model/moList';
import { changeValue } from '../../apps/model/moListItem';


export const dispOptions = function () {

  // fetch data from rest server defs in fetch, fill with target
  // ufms -> dul_org
  this.fetch_toOptions = d => {
    let [fetch, map_key, str_fetch = '', callback = null] = d;
    // fetch::String key in suite defines model data 
    //   with params as fetch in changedItem[fetch]
    //
    // map_key::String key in options map to set with fetched data list
    // 
    // str_fetch::String additional alias key for ds1, ds2 applied firstly
    //
    // callback if any, call in then and may return reject to catch the error
    //
    //console.log('toOtions',fetch, map_key, str_fetch);
    return getList(this.state().suite, fetch, `fetch_${str_fetch}`).
      then(res => {
        this.state().options.set(map_key, res.list);
        if (!!callback && typeof callback === 'function')
          return callback(res.list);
        return res.list;//[0];
      }).
      catch(err => this.state().options.set(
        map_key, [{ error: `red&${err.error}` }]
      ));
    //finally( memost(target) );
  };

  this.fetch_toForm = d => {
    let [fetch, map_key, get_fromData, set_toForm] = d;
    // fetch::String key in suite defines model data 
    //   with params as fetch in changedItem[fetch]
    //
    // map_key::String key in options map to set with fetched data list
    // 
    // get_fromData::String prop in fetched object to get
    //  
    // set_toForm::String key in from to set with value got with get_fromData
    // 
    return this.fetch_toOptions([fetch, map_key]).then(items => {
      let name = set_toForm || '',
        value = (items && items[0]) ? items[0][get_fromData] : '';
      if (name && value)
        // set field in form if any
        changeValue({ 'target': { name, value } });
    });
  };

};
