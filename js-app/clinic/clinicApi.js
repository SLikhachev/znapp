

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
      stup({ suite, unit, options: null, count: null, table: false, error: '' });
      if (R.isNil(state().year))
        stup({year: _year()});
      //console.log(suite, unit);
      let def = state().suite[state().unit];
      if (!!def.count)
        return this.count(def);
    },
    
    count(d) {
      if (!!state().error)
        return;
      if (R.isNil(state().count)) // calculate once for menu changed
        return getList(d, 'count').
          then(res => stup({ count: res, error: null, list: [] })).
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
      stup({ options: null });
      return getData(state().suite, state().unit).
        then(res => stup(res)).
        catch(err => stup(err));
    },
    
    card(d) {
      let [suite, crd] = d, [method, word] = patch;
      //console.log('crd ',crd);
      // new card
      if (crd === 'add') {
        crd= '';
        [method, word]  = post;
      }
      // if not set then no POST to data will be send
      if (R.isNil(state().year))
        stup({year: _year()});
      
      stup({
        suite,
        unit: 'card', crd, data: null, method, word,
        tabs: cardTabs, error: '', errorsList: [],
      });
      
      if (R.isNil(states().options))
        this.opts();
      
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
          listItem(card); // card object from Map
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
      // if not set then no POST to data will be send
      if (R.isNil(state().year))
        stup({year: _year()});
      
      stup({
        suite,
        unit: 'talon', crd, tal, data: new Map(), options: new Map(), 
        method, word, error: null, errorsList: [],
        tabs: talonTabs, 
      });
      return;
    },

    // fetch data from rest server defs in fetch, fill with target
    fetch_rest(d) { // ufms -> dul_org
      // fetch data with params as fetch (in changedItem[fetch])
      // result write to target 
      let [fetch, source, target] = d;
      console.log(source);
      return getList(state().suite, fetch, 'fetch').
        then(res => {
          let list = checkArray(res.list) ? res.list : [],
          name= target, 
          value = list[0] ? list[0][source] : '';
          
          //if (res.list && res.list.length > 0) {
            // set field in form
            changeValue({ 'target': { name, value }}); //res.list[0][source] } });
            //console.log('after fetch', changeValue());
            // set in opts.map
            state().options.set(target, list);
          //} 
        }).
        catch(err => state().options.set(target, [{ error: `red&${err.error}`}]))
        //finally( memost(target) );
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
