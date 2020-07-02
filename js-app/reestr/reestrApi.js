
// src/report/reportApi.js
/**
  */
import { up } from '../apps/utils';
import { states, update, initApp } from '../apps/appApi';
//mport { _mo } from '../apps/model/moModel';
import { listItem, itemId, changedItem } from '../apps/model/moListItem';
import { formItem, formSubmit } from '../apps/model/moFormModel';
import { getList } from '../apps/model/moList';
import { reestrMenu } from './reestrMenu';


const Actions = (state, update) => {
  // stream of states
  const stup = up(update);
  return {
    suite(d) { stup({ suite: d[0] }) },
    unit(d) {
      let [suite, unit] = d;
      let pk = suite[unit].item.pk || 'id';
      stup({ suite, unit, pk, message: '', list: [], error: null });
      listItem(formItem(suite, unit));
      itemId(unit);
      return this.fetch();
      /*
      if (!R.isNil(suite[unit].rest))
        return this.list();
      */
    },
    fetch() {
      state().suite[state().unit].fetch ?
        getList(state().suite, state().unit, 'fetch').
          then(res => stup({ fetch: res.list[0] })) :
        stup({ fetch: null });
    },
    list() {
      //stup({ list: [], error: null });
      state().suite[state().unit].rest ?
        getList(state().suite, state().unit).
          then(res => stup(res)) :
        stup({ list: [] });
    },
    confirm() {
      let conf = state().suite[state().unit].task || {}, prompt;
      if (conf.confirm) {
        prompt = conf.prompt || 'Код для задачи';
        if (window.prompt(prompt) !== conf.confirm())
          return false;
      }
      return true;
    },
    task(d) {
      // confirm task
      if (!this.confirm())
        return;
      // run task
      let [event] = d;
      const resp = document.getElementById('resp');
      resp.open = false;
      event.target.classList.add('disable');
      stup({ error: null, message: '' });
      formSubmit('task',
        state().suite,
        state().unit,
        changedItem()).
        then(res => { stup(res); return res.done }).
        then(done => done ? void false : this.list()).
        catch(err => stup(err)).
        finally(() => {
          resp.open = true;
          event.target.classList.remove('disable');
        });
    },
  }
}

//const actions = Actions(states, update); //=> obj of func ref

export const initReestr = () => initApp(
  { suite: { page: "Медстатстика: Реестры и Счета ОМС" } },
  reestrMenu,
  Actions(states, update)
);
