
// src/report/reportApi.js
/**
  */
import { up } from '../apps/utils';
import { states, update, initApp } from '../apps/appApi';
import { listItem, itemId, changedItem } from '../apps/model/moListItem';
import { formItem, formSubmit } from '../apps/model/moFormModel';
import { getList } from '../apps/model/moList';
import { reportMenu } from './reportMenu';

/*
const initial = {
  suite: { page: "Медстатстика: Отчеты" }
}
*/

const Actions = (state, update) => {
  // stream of states
  const stup = up(update);
  return {
    suite(d) { stup({ suite: d[0] }) },
    unit(d) {
      let [suite, unit] = d;
      let pk = suite[unit].item.pk || 'id';
      stup({ suite, unit, pk, message: '' });
      listItem(formItem(suite, unit));
      itemId(unit);
      if (!R.isNil(suite[unit].rest))
        return this.list();
    },
    list(fetch = '') {
      stup({ list: [], error: null });
      return getList(state().suite, state().unit, fetch).
        then(res => stup(res))
    },
    task(d) {
      let [event] = d;
      const resp = document.getElementById('resp');
      resp.open = false;
      event.target.classList.add('disable');
      stup({ error: null, message: '' });
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
  }
}

//const actions = Actions(states, update); //=> obj of func ref

export const initReport = () => initApp(
  { suite: { page: "Медстатстика: Отчеты" } },
  reportMenu,
  Actions(states, update)
);
