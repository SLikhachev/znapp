
// src/sparv/spravApi.js
/**
  */
import { up } from '../apps/utils';
import { states, update, disp } from '../apps/appApi';
import { listItem, itemId, changedItem } from '../apps/model/moListItem';
import { formItem, runTask, formSubmit } from '../apps/model/moFormModel';
import { reportMenu } from './reportMenu';


//import { getList, sortList } from './model/moList';
//import { getItem, listItem, itemId, saveItem } from './model/moListItem';
//import { getData } from './model/moData';


const initial = {
  suite: { page: "Медстатстика: Отчеты" }
}

const Actions = (state, update) => {
  // stream of states
  const stup = up(update);
  return {
    suite(d) { stup({ suite: d[0] }) },
    unit(d) {
      let [suite, unit] = d;
      let pk = suite[unit].item.pk || 'id';
      stup({ suite, unit, pk });
      listItem(formItem(suite[unit]));
      itemId(unit);
      return this.list();
    },
    list(fetch = '') {
      stup({ list: [], error: null });
      //return getList(state().suite, state().unit, fetch).
      //  then(res => stup(res))
    },
    task(d) {
      let [event] = d;
      //console.log(changedItem());
      const resp = document.getElementById('resp');
      resp.open = false;
      event.target.classList.add('disable');
      stup({ error: null, file: null, done: false, message: '', detail: '' });
      formSubmit('task',
        state().suite,
        state().unit,
        changedItem()).
        then(res => stup(res)).
        catch(err => stup(err)).
        finally(() => {
          resp.open = true;
          event.target.classList.remove('disable');
        });
    },
    /*
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
    */
  }
}

const actions = Actions(states, update); //=> obj of func ref

//[actionName, args] 
export const initApp = app => {
  Object.assign(
    app,
    { initial, menu: reportMenu }
  )
  disp.map(av => {
    let [event, ...args] = av;
    return actions[event] ? actions[event](args) : m.stream.SKIP
  });
}
