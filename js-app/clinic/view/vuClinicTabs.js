// src/clinic/view/vuCard.js

import { states } from '../../apps/appApi';
import { vuLoading } from '../../apps/view/vuApp';
import { tabsView } from './vuTabs.js';
import { tabEmpty, unitTabs } from './vuClinic';


export const vuClinicTabs = () => {

  let thisTabs, 
    tabs = [tabEmpty("Пусто", "Нет закладок (no tabs in states)")];

  return {
    view() {
      thisTabs = unitTabs[states().unit] || tabs;

      return states().error ? [m(".error", states().error)] :
        states().optionsReady && states().data ?
          m(tabsView, { thisTabs } ) : m(vuLoading);
    }
  };
};
