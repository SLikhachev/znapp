
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
import { cardTabs } from './view/vuClinic';
import { talonTabs } from './view/vuClinic';


const patch = ['PATCH', "Изменить"];
const post = ['POST', "Добавить"];

const Actions = (state, update) => {
  // stream of states
  const stup = up(update);
  
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
          catch(err => stup(err));
      return;
    },
    
    fetch() {
      stup({ list: null, error: null, table: true });
      return getList(state().suite, state().unit, 'fetch').
        then(res => stup(res)).
        catch(error => stup(error));
    },
 
    opts() {
      let data = state().options; //Map
      
      console.log('opts ', data);

      if (R.isNil(data))
        return getData(state().suite, state().unit).
          catch(err => stup(err)).
          then(res => stup(res));
          
      
      let unit = state().suite[state().unit];
      console.log('opts', unit );
      
      if (!R.hasPath(['rest', 'options'], unit))
        return;
     
      
      // these keys were loaded 1st for check; 
      if ( !data.has( unit.rest.options[0] ) )
        return getData(state().suite, state().unit).
          then(res => stup({
            options: new Map([...data, ...res.options]) 
          })).
          catch(err => stup(err)).
      return;  
    },
    
    card(d) {
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

      (this.opts());
      
      // get card number from this stream initailly
      changedItem({ crd_num: crd, old_num: crd });
      
      if (crd === '') {
          //console.log(' crd emp ', crd );
          stup({data: new Map()});
          listItem({});
          itemId(crd);
          return;
      }
      return getData(state().suite, 'card', 'data').
        then(res => {
          stup(res);// card and list of talons in Map
          let card = state().data.get('card')[0] || {};
          if (R.isNil(card) || R.isEmpty(card))
            stup({ error: 'Карта не найдена'});
          listItem(R.assoc('old_card', crd, card)); // card object from Map
          itemId(crd); // just string
        }).
        catch(err => stup(err));
    },
    
    talon(d) {
      let [suite, crd, tal] = d, [method, word] = patch;

      if (tal === 'add') {
        tal= '';
        [method, word]  = post;
      }
      //console.log(state());
      stup({
        suite,
        unit: 'talon', crd, tal, data: new Map(), //options: new Map(),
        method, word, error: '', errorsList: [],
        tabs: talonTabs, 
      });

      if (R.isNil(state().year))
        stup({year: _year()});

      //console.log('talon');
      return (this.opts());
      
      //return;
    },

    // fetch data from rest server defs in fetch, fill with target
    fetch_rest(d) { // ufms -> dul_org
      let [fetch, source, target] = d;
      // fetch::String key in suite defines model data 
      //   with params as fetch in changedItem[fetch]
      //
      // source::String prop in fetched object to get
      //  
      // target::String key in from to set with value got with source
      // 

      console.log(source);
      return getList(state().suite, fetch, 'fetch').
        then(res => {
          let list = checkArray(res.list) ? res.list : [],
            name = target || '', 
            value = list[0] ? list[0][source] : '';
          
          state().options.set(target, list);
          
          if (name && value) {
            // set field in form if any
            changeValue({ 'target': { name, value }}); //res.list[0][source] } });
            //console.log('after fetch', changeValue());
            
          } 
        }).
        catch(err => state().options.set(target, [{ error: `red&${err.error}`}]))
        //finally( memost(target) );
    },
    
    diags(){
      console.log('diags');
      //return (this.fetch_rest('mkb', 'ds1', 'code'));
    },

    save(d) {
        let [item, event] = d;
        vuDialog.error = '';
        stup({
          errorsList: state().suite[item].item.validator(changedItem)
        });

        if (!R.isEmpty(state().errorsList)) {
          vuDialog.open();
          return;
        }
        
        event.target.classList.add('disable');
        return saveItem(state().suite[item], 'item', state().method).
        then(res => {
          if (checkArray(res)) {
            listItem(res[0]); 
            itemId(res[0].crd_num);
            stup({ crd: itemId()});
            changeValue(target('crd_old', itemId()));
          }
        }).
        catch(error => {
          vuDialog.error = error.saverror;
          vuDialog.open();
        }).
        finally(() => event.target.classList.remove('disable'));
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
  { suite: { page: "Медстатстика: Поликлиника" } },
  clinicMenu,
  Actions(states, update)
);
