
'use strict';

// src/report/reportApi.js
/**
  */

import { _year } from '../../apps/model/moModel';
import { getList } from '../../apps/model/moList';
import { talons } from '../defines/defTalons';


export const dispSuite = function () {
  
  this.suite = d => {
    let [suite, unit] = d;
    this.stup({ suite, unit, count: null, table: false , error: '' });
    
    if (R.isNil(this.state().year))
        this.stup({year: _year()});

    let def = this.state().suite[this.state().unit];
    
    if (!!def.count)
      return this.count(def);
    
    if(!!def.list)
      return this.fetch([]);
    
    };

    this.count= d => {
      if (!!this.state().error)
        return;
      if (R.isNil(this.state().count)) // calculate once for menu changed
        return getList(d, 'count').
          then(res => this.stup({ count: res, error: '', list: [] })).
          catch(this._catch);
      return;
    };
    
    this.fetch = d => {
      let [fetch=''] = d;
      this.stup({ list: null, error: null, table: true });
      //console.log('fetch', fetch);
      return getList(this.state().suite, this.state().unit, fetch).
        then(res => this.stup(res)).
        catch(this._catch);
    };

    this.year= d => {
      let [event] = d;
      this.stup({
        year: event.target.value
      });
      // redirect to talons
      if (this.state().unit === 'talons')
        m.route.set(talons.path);
    };
};
