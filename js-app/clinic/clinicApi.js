
// src/report/reportApi.js
/**
  */
import { up } from '../apps/utils';
import { states, update, initApp } from '../apps/appApi';
import { listItem, itemId, changedItem } from '../apps/model/moListItem';
//import { formItem, formSubmit } from '../apps/model/moFormModel';
import { getList } from '../apps/model/moList';
import { clinicMenu } from './clinicMenu';


const Actions = (state, update) => {
  // stream of states
  const stup = up(update);
  return {
    suite(d) {
      let [suite, unit] = d;
      stup({ suite, unit });
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
  }
}

//const actions = Actions(states, update); //=> obj of func ref

export const initClinic = () => initApp(
  { suite: { page: "Медстатстика: Поликлиника" } },
  clinicMenu,
  Actions(states, update)
);
