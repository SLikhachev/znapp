
'use strict';

// src/report/reportApi.js
/**
  */
import { checkArray } from '../../apps/utils';
import { _year } from '../../apps/model/moModel';
import { getData } from '../../apps/model/moData';


const $crd_num = new RegExp(/\w{1,9}/);
const $tal_num = new RegExp(/\d{1,6}/);


export const dispUnit = function () {
  
  this._opts = () => {
    let def = this.state().suite, unit= this.state().unit;

    let error = R.hasPath(['rest', 'options'], def[unit]) ? 
      '' : `Actions OPTS: No OPTIONS prop for: ${unit} `;
      error = error + (error ? '' : checkArray(def[unit].rest.options) ? 
        '' : `Actions OPTS: Empty OPTIONS list: ${unit}`); 
    
    if (!!error)
      return Promise.reject({ error });
    //return Promise.resolve('no options here da i xep c nim');
      
    let data = this.state().options || new Map();  //Map
    this.stup({ optionsReady: false });

    // initially get otions
    if ( data.size === 0)
      return getData(def, unit)
        .then(res => {
          this.stup(res);
          return 'opts loaded';
        });
      
      // get missing options
    return getData(def, unit, 'options', [...data.keys()])
      .then(res => {
        this.stup({ 
          options: new Map([...data, ...res.options])
        });
        return 'opts added';
      });
    };

    this._unit = unit => { 
      return { 
        card: this._card,
        talon: this._talon
      }[unit] || this._card;
    };

    this.unit= d => {
      let [suite, unit, args] = d, 
        { card, talon='' } = args;
      //console.log('unit', unit, card );
      console.assert( unit === 'card' || unit === 'talon' ); 
      console.assert(['Cards', 'Talons'].indexOf(suite.name) >= 0 );

      card = card.match($crd_num); 
      card = (card && card[0]) || 'add';
      
      talon = talon.match($tal_num);
      talon = Number(talon && talon[0]) || 'add';
      
      if (R.isNil(this.state().year))
        this.stup({year: _year()});

      console.assert( !!card && !!talon );
      
      this.stup({ suite, unit });

      return Promise.all([
        this._opts(),
        this._unit(unit)([suite, {card, talon}])
      ])
      .then(res => this.stup({ optionsReady: true }))
      .catch(this._catch);
    };

};
