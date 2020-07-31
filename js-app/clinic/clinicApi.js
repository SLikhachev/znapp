
// src/report/reportApi.js
/**
  */
import { up } from '../apps/utils';
import { states, memost, update, initApp } from '../apps/appApi';
import { listItem, itemId, changedItem, changeValue } from '../apps/model/moListItem';
//import { formItem, formSubmit } from '../apps/model/moFormModel';
import { checkArray } from '../apps/model/moModel';
import { getList } from '../apps/model/moList';
import { clinicMenu } from './clinicMenu';
import { getData } from '../apps/model/moData';

/*
export const setMemo = (key, value) => memo(
  Object.assign( memo(), { [key]: value } )
)
*/

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
      let [suite, crd] = d;
      stup({
        suite,
        unit: 'card', crd, data: null,
        error: null, errorsList: [],
      });
      if (R.isNil(states().options))
        this.opts();
      changedItem({ crd_num: crd });
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
    }
  };
};

//const actions = Actions(states, update); //=> obj of func ref

export const initClinic = () => initApp(
  { suite: { page: "Медстатстика: Поликлиника" } },
  clinicMenu,
  Actions(states, update)
);
