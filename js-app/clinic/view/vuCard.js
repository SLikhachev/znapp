// src/clinic/view/vuCard.js

/*
import { states } from '../../apps/appApi';
import { vuLoading } from '../../apps/view/vuApp';
import { tabsView } from './vuTabs.js';
import { crdEmpty } from './vuClinic';
import { crdMain } from './vuCardMain';
import { crdVizits } from './vuCardVizits';


const cardTabs = [
  {
    name: "Карта",
    content() { return m(crdMain); }
  },
  {  
    name: "Визиты", 
    content() { return m(crdVizits); }
  },
  crdEmpty("Дополнительно", "Дополнительно"),
  crdEmpty("Прикрепить", "Прикрепить"),
  crdEmpty("Удалить", "Удалить/Объеденить"),
];

export const vuCard = () => {
  return {
    view() {
      //console.log('vuCard');
      return states().error ? [m(".error", states().error)] :
        states().options && states().data ?
          m(tabsView, { thisTabs: cardTabs }) : m(vuLoading);
    }
  };
};
*/