
// src/sparv/spravApi.js
/**
  */

//import { vuDialog } from '../apps/view/vuDialog';
import { vuPageTitle } from '../apps/view/vuMain';
import { vuSprav } from './view/vuSprav';
import { getList, sortList } from './model/moList';
import { getItem, listItem, itemId, saveItem } from './model/moListItem';
import { getData } from './model/moData';

import { up } from './apiFunc';


const [stream, scan] = [m.stream, m.stream.scan];


const app = {
  initial: {
    suite: { page: "Медстатстика: Справочнкики" },
    //unit: null,
    //pk: null,
    //list: null,
    //error: null,
    //method,
    //word,
    //id,

  },

  Actions(state, update) {
    // stream of states
    const stup = up(update);
    return {
      suite(d) { stup({ suite: d[0] }) },
      unit(d) {
        let [suite, unit] = d;
        let pk = suite[unit].item.pk || 'id';
        stup({ suite, unit, pk });
        return this.list();
      },
      list(fetch = '') {
        stup({ list: null, error: null });
        return getList(state().suite, state().unit, fetch).
          then(res => stup(res))
      },
      sort(d) {
        stup(sortList(d[0], state))
      },
      add() {
        return this.change(['POST', "Добавить", '']);
      },
      // change in controlled form 
      change(d) { // method, word, id
        let [method, word, id] = d;
        stup({ method, word, id, saverror: null })
        listItem(getItem(id, state().pk, state().list));
        itemId(id);
      },
      // save from streams of controlled form
      saveitem() {
        //stup({ saverror: null });
        saveItem(state().suite, state().unit, state().method).
          then(() => this.list()).catch(error => stup(error));
      },
      fetch() {
        return this.list('fetch');
      },
      opts() {
        stup({ options: null });
        return getData(state().suite, state().unit).
          then(res => stup(res))
      },
      pmu(d) {
        let [suite, unit, id] = d;
        let pk = suite[unit].item.pk || 'id';
        stup({ suite, unit, pk });
        this.change(['PATCH', 'Изменить', id]);
        return this.opts();
      },
      pmugrup(d) {
        stup({ saverror: null });
        let [code_usl, grup, method] = d;
        saveItem(state().suite, 'pmu_grup_code', method, { code_usl, grup, method }).
          then(() => this.opts()).catch(error => stup(error));
      },
    }
  }
}


const update = stream(); // update states stream
const acc = (state, patch) => patch(state);
export const states = scan(acc, app.initial, update);

export const disp = stream(); // event dispatcher stream 
const actions = app.Actions(states, update); //=> obj of func

//[actionName, args] 
disp.map(av => {
  let [event, ...args] = av;
  return actions[event] ? actions[event](args) : stream.SKIP
})

// 
export const torender = path => {
  disp(['suite', path.def]);
  return vuSprav(m(vuPageTitle, { text: states().suite.page }));
}

// route on match helper
export const tomatch = (path, view) => args => {
  //console.count('on match')
  const { item } = args;
  const idx = path.items.indexOf(item);
  if (idx < 0) return m.route.SKIP;
  disp(['unit', path.def, item]);
  return view;
}


