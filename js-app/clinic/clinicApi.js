
//'use strict';

// src/report/reportApi.js
/**
  */
import { up, checkArray } from '../apps/utils';
import { states, memost, update, initApp } from '../apps/appApi';
import { _year } from '../apps/model/moModel';
import { getData } from '../apps/model/moData';
import { getList } from '../apps/model/moList';
import { listItem, itemId, changedItem, 
  changeValue, saveItem, target } from '../apps/model/moListItem';
import { vuDialog } from '../apps/view/vuDialog';
import { clinicMenu } from './clinicMenu';
import { talons } from './defines/defTalons';
import { newTalonCard } from './model/moTalons';
import { cardTabs } from './view/vuClinic';
import { talonTabs } from './view/vuClinic';


const patch = ['PATCH', "Изменить"];
const post = ['POST', "Добавить"];

const Actions = (state, update) => {
  // stream of states
  const stup = up(update);
  const _reject = err => Promise.reject(err);
  const _catch = err => stup(err);

  return {
    
    suite(d) {
      let [suite, unit] = d;
      stup({ suite, unit, count: null, table: false , error: '' });
      
      if (R.isNil(state().year))
        stup({year: _year()});

      let def = state().suite[state().unit];
      if (!!def.count)
        return this.count(def);
    },
    
    count(d) {
      if (!!state().error)
        return;
      if (R.isNil(state().count)) // calculate once for menu changed
        return getList(d, 'count').
          then(res => stup({ count: res, error: '', list: [] })).
          catch(_catch);
      return;
    },
    
    fetch() {
      stup({ list: null, error: null, table: true });
      return getList(state().suite, state().unit, 'fetch').
        then(res => stup(res)).
        catch(_catch);
    },
 
    opts() {
      
      let def = state().suite, unit= state().unit;

      console.log('opts unit: ', unit);


      let error = R.hasPath(['rest', 'options'], def[unit]) ? 
        '' : `No OPTIONS prop for: ${unit} `;
      error = error + (error ? '' : checkArray(def[unit].rest.options) ? 
        '' : ` Empty OPTIONS list: ${unit}`); 

      if (!!error)
        return Promise.reject({ error });

      let data = state().options || new Map();  //Map
      stup({ optionsReady: false });

      console.log('opts data: ', data);
      // initially get otions
      if ( data.size === 0)
        return getData(def, unit)
          .then(res => {
            stup(res);
            return 'opts loaded';
          });
      
      // get missing options
      // these keys were loaded ?  1st for check; 
      if ( !data.has( def[unit].rest.options[0] ) )
        return getData(def, unit)
          .then(res => {
            stup({ 
              options: new Map([...data, ...res.options])
            });
            return 'opts added';
          });
          //catch(err => Promise.reject(err));

      return Promise.resolve('opts resolved');
    },
    
    card(d) {
      return Promise.all( [this._card(d), this.opts()] )
        .then(() => stup({ optionsReady: true }))
        .catch(_catch);
     },

    _card(d) {
      let [suite, crd] = d, [method, word] = patch;
      //console.log('crd ',crd);
      // new card
      if (crd === 'add') {
        crd= '';
        [method, word]  = post;
      }
      stup({
        suite,
        unit: 'card', crd, data: null, method, word,
        error: '', errorsList: [],
        tabs: cardTabs,
      });

      if (R.isNil(state().year))
        stup({year: _year()});

      //(this.opts());
      
      // get card number from this stream initailly
      changedItem({ crd_num: crd, old_num: crd });
      
      if (crd === '') {
          //console.log(' crd emp ', crd );
          stup({data: new Map()});
          listItem({});
          itemId(crd);
          return Promise.resolve('new card');
      }
      return getData(state().suite, 'card', 'data')
        .then(res => {
          stup(res);// card and list of talons in Map
          let card = state().data.get('card')[0] || {};
          if (R.isNil(card) || R.isEmpty(card))
            stup({ error: 'Карта не найдена'});
          listItem(R.assoc('old_card', crd, card)); // card object from Map
          itemId(crd);
          return 'card loaded'; // just string
        });
        //.catch(_reject);
    },
    
    talon(d) {
      return Promise.all( [this._talon(d), this.opts()] )
        .then(() => stup({ optionsReady: true }))
        .catch(_catch);
    },

    _talon(d) {
      let [suite, crd, tal] = d, [method, word] = patch;

      if (tal === 'add') {
        tal= '';
        [method, word]  = post;
      }
      
      stup({
        suite,
        unit: 'talon', crd, tal, data: null, //options: new Map(),
        method, word, error: '', errorsList: [],
        tabs: talonTabs, 
      });

      if (R.isNil(state().year))
        stup({year: _year()});
     
      changedItem({ crd_num: crd, tal_num: tal });

      return getList(state().suite, 'card')
        .then(
          res => {
            //console.log(res);
            if (R.isEmpty(res.list)) {       
              stup({ error: 'Карта не найдена'});
            } else {
              stup({ data: new Map()});
              listItem( newTalonCard(res.list[0]) ); // card object from Map
              itemId(crd); // just string
              state().data.set('card', res.list[0]);
            }
            return 'talon loaded';
        });
        //.catch(err => stup(err));
    },

    // fetch data from rest server defs in fetch, fill with target
    fetch_toOptions(d) { // ufms -> dul_org
      let [fetch, map_key, str_fetch=''] = d;
      // fetch::String key in suite defines model data 
      //   with params as fetch in changedItem[fetch]
      //
      // map_key::String key in options map to set with fetched data list
      // 
      // str_fetch::String additional alias key for ds1, ds2 applied firstly
      //
      //console.log('toOtions',fetch, map_key, str_fetch);
      return getList(state().suite, fetch, `fetch_${str_fetch}`).
        then(res => {
          state().options.set(map_key, res.list);
          return res.list[0];
        }).
        catch(err => state().options.set(map_key, [{ error: `red&${err.error}`}]))
        //finally( memost(target) );
    },
    
    fetch_toForm(d){
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
      return this.fetch_toOptions([fetch, map_key]).then(item => {
        let name = set_toForm || '', 
            value = item ? item[get_fromData] : '';
        if (name && value)
            // set field in form if any
            changeValue({ 'target': { name, value }});
      });
    },

    save(d) {
        let [item, event, method=''] = d;
        vuDialog.error = '';
        stup({
          errorsList: state().suite[item].item.validator(changedItem)
        });

        if (!R.isEmpty(state().errorsList)) {
          vuDialog.open();
          return;
        }
        
        //return false;
        
        // this trap for card save in talon form
        method = method || state().method;

        event.target.classList.add('disable');
        return saveItem(state().suite[item], 'item', method)
          .then(res => {
            if (checkArray(res)) {
              listItem(res[0]); 
              itemId(res[0].crd_num);
              stup({ crd: itemId()});
              changeValue(target('crd_old', itemId()));
            }
          })
          .catch(error => {
            vuDialog.error = error.saverror;
            vuDialog.open();
          })
          .finally(() => event.target.classList.remove('disable'));
    },

    year(d) {
      let [ event ] = d;
      stup({ year: event.target.value });
      // redirect to talons
      if (state().unit === 'talons')
        m.route.set(talons.path);
    },

  };
};

//const actions = Actions(states, update); //=> obj of func ref

export const initClinic = () => initApp(
  { suite: { page: "Медстатстика: Поликлиника" },
    inited: true
  },
  clinicMenu,
  Actions(states, update)
);
