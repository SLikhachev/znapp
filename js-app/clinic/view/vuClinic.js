
// src/clinic/view/vuClinic.js

import { crdMain } from './vuCardMain';
import { crdVizits } from './vuCardVizits';
import { vuTalon } from './vuTalon';


export const tabEmpty = (name, header) => ({
  name,
  content() { return m('h2', header); }
});


export const cardTabs = [
  {
    name: "Карта",
    content() { return m(crdMain); }
  },
  {  
    name: "Визиты", 
    content() { return m(crdVizits); }
  },
  tabEmpty("Дополнительно", "Дополнительно"),
  tabEmpty("Прикрепить", "Прикрепить"),
  tabEmpty("Удалить", "Удалить/Объеденить"),
];


export const talonTabs = [
  {
    name: "Талон",
    content() { return m(vuTalon); }
  },

  tabEmpty("ПМУ", "ПМУ"),
  tabEmpty("Удалить", "Удалить"),
];



