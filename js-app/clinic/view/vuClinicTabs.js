// src/clinic/view/vuCard.js

import { states } from '../../apps/appApi';
import { vuLoading } from '../../apps/view/vuApp';
import { tabsView } from './vuTabs.js';
import { tabEmpty } from './vuClinic';


export const vuClinicTabs = () => {
  
  let thisTabs, 
    tabs = [tabEmpty("Пусто", "Нет закладок (no tabs in states)")];

  return {
    view() {
      thisTabs = states().tabs || tabs;

      return states().error ? [m(".error", states().error)] :
        states().options && states().data ?
          m(tabsView, { thisTabs} ) : m(vuLoading);
    }
  };
};
