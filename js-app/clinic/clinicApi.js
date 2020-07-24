
// src/report/reportApi.js
/**
  */
import { up } from '../apps/utils';
import { states, update, initApp } from '../apps/appApi';
import { listItem, itemId, changedItem, changeValue } from '../apps/model/moListItem';
//import { formItem, formSubmit } from '../apps/model/moFormModel';
import { getList } from '../apps/model/moList';
import { clinicMenu } from './clinicMenu';
import { getData } from '../apps/model/moData';


const Actions = (state, update) => {
  // stream of states
  const stup = up(update);
  const setMemo = (key, value) => ({
    memo: R.assoc(key, value, state().memo)
  })

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
        catch(err => stup(err))
    },
    card(d) {
      let [suite, crd] = d;
      stup({
        suite,
        unit: 'card', crd, data: null,
        error: null, errorsList: [],
        memo: {}
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
    memo(d) {
      let [name, value, msg] = d;
      changeValue({ target: { name, value } });
      stup(setMemo(name, msg))
    },

    //get_data ('mo_att', 'mo_lacal', 'scode', 'sname', 
    //  'Нет такого МО', '') 
    // find data in prefetched options
    find_opts(d) { // -> this.memo
      let [data, find, get, notfind, first = ''] = d
      // data - String -> key in data MAP to get
      // find - String -> prop in data array item to find
      // get - String -> prop in data array to get if find 
      // notfind - String -> text to output if item not find
      // first - String if 'first' then output first word only from finded text 

      let value = changedItem()[find], opts = state().options;
      if (!value || !opts)
        return this.memo(find, null, '');

      let item = opts.get(data).find(it => it[find].toString() == value);

      if (item !== undefined) {
        if (!first)
          return this.memo(find, value, `${item[get]} `);
        return this.memo(find, value, `${item[get].split(' ')[0]} `);
      }
      return this.memo(find, value, `red&${notfind} `);
    },

    // fetch data from rest server defs in fetch, fill with target 
    fetch_rest(d) { // ufms -> dul_org
      let [fetch, target, msg] = d
      stup(setMemo(target, '')); // initially empty in memo
      const fn = (v, m) => this.memo(target, v, m)
      return getList(state().suite, fetch, 'fetch').
        then(res => {
          if (res.list && res.list.length > 0) {
            let uf = res.list[0].name;
            fn(uf, uf)
          } else {
            fn('', `red&${msg}`)
          }
        }).
        catch(err => fn('', `red&${err.error}`));
    }
  }
}

//const actions = Actions(states, update); //=> obj of func ref

export const initClinic = () => initApp(
  { suite: { page: "Медстатстика: Поликлиника" } },
  clinicMenu,
  Actions(states, update)
);
