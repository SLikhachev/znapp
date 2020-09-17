
'use strict';

// src/report/reportApi.js
/**
  */
import { up, checkArray } from '../apps/utils';
import { states, memost, update, initApp } from '../apps/appApi';
import { _year } from '../apps/model/moModel';
import { getData } from '../apps/model/moData';
import { getList } from '../apps/model/moList';
import { 
  listItem, 
  itemId, 
  changedItem, 
  changeValue, 
  saveItem, 
  target 
} from '../apps/model/moListItem';
import { vuDialog } from '../apps/view/vuDialog';
import { clinicMenu } from './clinicMenu';
import { cardPath } from './defines/defCards';
import { talonPath, talons } from './defines/defTalons';
import { 
  initTalon,
  toSaveTalon
} from './model/moTalons';
import { cardTabs } from './view/vuClinic';
import { talonTabs } from './view/vuClinic';


const patch = ['PATCH', "Изменить"];
const post = ['POST', "Добавить"];
const $crd_num = new RegExp(/\w{1,9}/);
const $tal_num = new RegExp(/\d{1,6}/);


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

      let error = R.hasPath(['rest', 'options'], def[unit]) ? 
        '' : `No OPTIONS prop for: ${unit} `;
      error = error + (error ? '' : checkArray(def[unit].rest.options) ? 
        '' : ` Empty OPTIONS list: ${unit}`); 
      if (!!error)
        return Promise.reject({ error });
        //return Promise.resolve('no options here da i xep c nim');
      
      let data = state().options || new Map();  //Map
      stup({ optionsReady: false });

      // initially get otions
      if ( data.size === 0)
        return getData(def, unit)
          .then(res => {
            stup(res);
            return 'opts loaded';
          });
      
      // get missing options
      // those keys were loaded ?  1st for check; 
      if ( !data.has( def[unit].rest.options[0] ) )
        return getData(def, unit)
          .then(res => {
            stup({ 
              options: new Map([...data, ...res.options])
            });
            return 'opts added';
          });

      return Promise.resolve('opts resolved');
    },
    
    _unit(unit) { return { 
      card: this._card,
      talon: this._talon
      }[unit] || this._card;
    },

    unit(d) {
      let [unit, suite, args] = d, 
        //[method, word] = patch,
        { card, talon='' } = args;
      
      console.assert( unit === 'card' || unit === 'talon' ); 
      console.assert(['Cards', 'Talons'].indexOf(suite.name) >= 0 );

      card = card.match($crd_num); 
      card = (card && card[0]) || 'add';
      
      talon = talon.match($tal_num);
      talon = Number(talon && talon[0]) || 'add';
      
      if (R.isNil(state().year))
        stup({year: _year()});

      console.assert( !!card && !!talon );
      
      return Promise.all([
          this._unit(unit)([suite, {card, talon}]), 
          this.opts()])
        .then(() => stup({ optionsReady: true }))
        .catch(_catch);
    },
    
    _card(d) {
      let [suite, args] = d, 
        { card } = args, 
        [method, word] = patch;
      console.log('_card ', card);
      // new card
      if (card === 'add') {
        card= '';
        [method, word]  = post;
      }  

      stup({
        suite,
        unit: 'card', card, data: null, method, word,
        error: '', errorsList: [],
        tabs: cardTabs,
      });

      // get card number from this stream initailly
      changedItem({ crd_num: card, old_num: card });
      
      if (card === '') {
          //console.log(' crd emp ', crd );
          stup({data: new Map()});
          listItem({});
          itemId(card);
          return Promise.resolve('new card');
      }
      return getData(state().suite, 'card', 'data')
        .then(res => {
          stup(res);// card and list of talons in Map to state.data
          
          let card_obj = state().data.get('card')[0] || {};
          
          if (R.isNil(card_obj) || R.isEmpty(card_obj))
            stup({ error: 'Карта не найдена'});
          
          // init changedItem
          listItem(R.assoc('old_num', card, card_obj)); // card object from Map
          itemId(card);
          
          return 'card loaded'; // just string
        });
    },
    
    _talon(d) {
      let [suite, args] = d, [method, word] = patch,
        { card, talon } = args;

      if (talon === 'add') {
        talon= '';
        [method, word]  = post;
      } 

      stup({
        suite,
        unit: 'talon', card, talon, data: null, //options: new Map(),
        method, word, error: '', errorsList: [],
        tabs: talonTabs, 
      });
     
      changedItem({ crd_num: card, tal_num: talon });
      
      // get talon and pmus NaN and ZERO Numbers are ignored
      if (!!talon) {
        return getData(state().suite, 'talon', 'data')
        .then(res => {
          stup(res);// talon and list of pmus in Map to state.data
          
          let talon_obj = state().data.get('talon')[0] || {};
          
          if (R.isNil(talon_obj) || R.isEmpty(talon_obj))
            stup({ error: 'Талон не найден'});
          
          // init changedItem
          listItem( initTalon(tal_obj) ); // talon object from Map
          itemId(talon_obj.tal_num);
          
          return 'talon and pmus loaded'; // just string
        });
      }

      // else just get card only
      return getList(state().suite, 'card')
        .then(
          res => {
            if (R.isEmpty(res.list)) {
              stup({ error: 'Карта не найдена'});
            } else {
              stup({ data: new Map()});
              listItem( initTalon({}, res.list[0]) ); // card object from Map
              itemId('Новый талон'); // just string no talon number
              state().data.set('card', res.list[0]);
            }
            return 'talon card loaded';
        });
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

    _saved(d) {
      let [res, item] = d;
      console.log('saved unit, card', item, state().unit, state().card);
      // card form saved
      if (state().unit === 'card') {
        console.log(' _saved card', changedItem())
        if (state().card === '' || 
          changedItem().old_num !== res[0].crd_num) {
          // redirect to just added or changed card (number changed)
          m.route.set(cardPath(res[0].crd_num));
        }
        console.log('just redraw');
        // update page current
        listItem(R.assoc('old_num', state().card, res[0]));
        // update changedItem
        itemId(res[0].crd_num);
        //stup({ card: itemId()});
        //changeValue(target('old_num', itemId()));
        return false;
      }
     
      // card form in talon saved
      if (item === 'card') {
        listItem( 
          Object.assign(changedItem(), talonCard( res[0] ) )
        );
        // update changedItem
        itemId(state().talon);
        return false;
      }
      
      // else update talon 
      if (state().talon === '')
        // redirect to just added talon
        m.route.set(talonPath(res[0].crd_num, res[0].tal_num));
      
      listItem(res[0]);
      itemId(res[0].tal_num);
      // update changedItem
      //stup({ talon: itemId()});
      return false;
    },

    save(d) {
        let [item, event, method = ''] = d;
        vuDialog.error = '';
        stup({
          errorsList: state().suite[item].item.validator(changedItem)
        });

        if (!R.isEmpty(state().errorsList)) {
          vuDialog.open();
          return false;
        }

        // test
        //return false;

        // this trap for card save in talon form
        method = method || state().method;

        // save card from changedItem() if data is null
        // else from data object
        let data = null;

        // save talonTalon from data object;
        
        if (state().unit === 'talon' && item === 'talon')
          data = toSaveTalon(); // save talon form


        // save all others from changedItem, 
        // fields to save rules by 'editable_fields': array of the item

        event.target.classList.add('disable');
        return saveItem(state().suite[item], 'item', method, data)
          //return representation then change current list item 
          .then(res => checkArray(res) ?
            this._saved([res, item]) :
            false
          )
          .catch(error => {
            vuDialog.error = error.saverror;
            vuDialog.open();
          })
          .finally(() => event.target.classList.remove('disable'));
      },

      year(d) {
        let [event] = d;
        stup({
          year: event.target.value
        });
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
