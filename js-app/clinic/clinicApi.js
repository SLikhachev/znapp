
// src/report/reportApi.js
/**
  */
import { up } from '../apps/utils';
import { states, update, initApp } from '../apps/appApi';
import { listItem, itemId, changedItem } from '../apps/model/moListItem';
//import { formItem, formSubmit } from '../apps/model/moFormModel';
import { getList } from '../apps/model/moList';
import { clinicMenu } from './clinicMenu';
import { getData } from '../apps/model/moData';


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
        catch(err => stup(err))
    },
    card(d) {
      let [suite, crd] = d;
      stup({ suite, unit: 'card', crd, data: null, error: null, errorsList: [] });
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
    }
  }
}

//const actions = Actions(states, update); //=> obj of func ref

export const initClinic = () => initApp(
  { suite: { page: "Медстатстика: Поликлиника" } },
  clinicMenu,
  Actions(states, update)
);
