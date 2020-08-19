

// src/report/reportApi.js
/**
  */
import { up, checkArray } from '../apps/utils';
import { states, memost, update, initApp } from '../apps/appApi';
import { getData } from '../apps/model/moData';
import { getList } from '../apps/model/moList';
import { listItem, itemId, changedItem, 
  changeValue, saveItem, target } from '../apps/model/moListItem';
import { vuDialog } from '../apps/view/vuDialog';
import { clinicMenu } from './clinicMenu';

const patch = ['PATCH', "Изменить"];
const post = ['POST', "Добавить"];

const Actions = (state, update) => {
  // stream of states
  const stup = up(update);
  
  return {
    
    suite(d) {
      let [suite, unit] = d;
      stup({ suite, unit, options: null });
      //console.log(suite, unit);
      let def = state().suite[state().unit];
      if (!!def.count)
        this.count(def);
    },
    
    count(d) {
      if (!!state().error)
        return;
      if (R.isNil(state().count)) {
        getList(d, 'count').
          then(res => stup({ count: res, error: null, list: [] })).
          catch(err => stup(err));
      }
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
      console.log(crd);
      // new card
      if (crd === 'add') {
        crd= '';
        [method, word]  = post;
      }
      stup({
        suite,
        unit: 'card', crd, data: null, method, word,
        error: null, errorsList: [],
      });
      
      if (R.isNil(states().options))
        this.opts();
      
      changedItem({ crd_num: crd, old_num: crd });
      if (crd === '') {
          stup({data: new Map()});
          listItem({});
          itemId(crd);
          return;
      }
      return getData(state().suite, 'card', 'data').
        then(res => {
          stup(res);// card and list of talons in Map
          listItem(state().data.get('card')[0]); // card object from Map
          itemId(crd); // just string
        }).
        catch(err => stup(err));
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
  };
};

//const actions = Actions(states, update); //=> obj of func ref

export const initClinic = () => initApp(
  { suite: { page: "Медстатстика: Поликлиника" } },
  clinicMenu,
  Actions(states, update)
);
