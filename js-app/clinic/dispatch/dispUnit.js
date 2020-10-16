
'use strict';

// src/report/reportApi.js
/**
  */
import { checkArray } from '../../apps/utils';
import { _year } from '../../apps/model/moModel';
import { getData } from '../../apps/model/moData';


const $crd_num = new RegExp(/\w{1,9}/);
const $tal_num = new RegExp(/\d{1,6}/);

//const patch = ['PATCH', "Изменить"];
//const post = ['POST', "Добавить"];

const $card = card => {
  let c = card.match($crd_num);
  c = c ? c[0] : 'add';
  return c === 'add' ? '' : c;
};

const $talon = talon => {
  let t = talon.match($tal_num);
  t = t && Number(t[0]);
  t = t ? t : 'add';
  return t === 'add' ? '' : t;
};
    

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
    this.stup({ optionsReady: '' });

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
        card: this._item,
        templ: this._item,
        talon: this._talon
      }[unit] || this.F;
    };

    this.unit= d => {
      let [suite, unit, args] = d,
        { card='', talon='' } = args;
        //[method, word] = patch;
      
      //console.log('unit', unit, card );
      //console.assert( unit === 'card' || unit === 'talon' );
      //console.assert(['Cards', 'Talons'].indexOf(suite.name) >= 0 );

      //card = item === 'card' ? id : card;
      //talon = item === 'talon' ? id : talon;

      card = $card(card);
      talon = $talon(talon);
      /*
      if (
        (unit === 'card' && !card) || 
        ((unit === 'talon' || unit === 'templ') && !talon)
      ) [method, word]  = post;
      */
      this.stup({
        suite, unit,
        card, talon, data: null,
        //method, word,
        error: '', errorsList: []
      });

      if (R.isNil(this.state().year))
        this.stup({year: _year()});
      
      return Promise.all([
        this._opts(),
        this._unit(unit)()
      ])
      .then(res => this.stup({ optionsReady: res }))
      .catch(this._catch);
    };

};
