
// src/clinic/view/vuClinic.js

'use strict';

// module difines tabs views for app menu

import { crdMain } from './vuCardMain';
import { crdVizits } from './vuCardVizits';
import { vuTalon } from './vuTalon';
import { talonAuxForm } from './vuTalonAux';
import { talonPmu } from './vuTalonPmu';
import { deleteTalon } from './vuTalonDelete';

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
  {
    name: "Направление",
    content() { return m(talonAuxForm, { auxform: 'naprForm' }); }
  },
  {
    name: "ПМУ",
    content() { return m(talonPmu); }
  },
  {
    name: "Полис на дату",
    content() { return m(talonAuxForm, { auxform: 'polisForm' }); }
  },
  {
    name: "ДС",
    content() { return m(talonAuxForm, { auxform: 'dstacForm' }); }
  },
  {
    name: "Открыть/Удалить",
    content() { return m(deleteTalon); }
  },
];

export const templTabs = [
  {
    name: "Шаблон талона",
    content() { return m(vuTalon); }
  },
  tabEmpty("Удалить", "Удалить"),
];


export const unitTabs = {
  card: cardTabs,
  talon: talonTabs,
  templ: templTabs
};

