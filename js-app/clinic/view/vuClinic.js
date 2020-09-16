
// src/clinic/view/vuClinic.js

import { states, disp } from '../../apps/appApi';
//import { _year } from '../../apps/model/moModel';
import { changedItem, changeValue, target } from '../../apps/model/moListItem';
import { thisYear } from '../model/moModel';
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

const $_value = value => item => !!item ? item : value;

const $_number = $_value('');
const $_name = $_value('новый');

//talon editable
export const _editable = type => 
  // talon_type: 
  // 0- deleted 1- open (may edit) 2- closed
  // talon of the same year may edit
  // case of 1. mek else we can not send it twice in same year
  thisYear() && (type == 1) ? 'открыт': 'закрыт'; 

const _tplName = talon => m('legend', `Шаблон ${_name(talon.crd_num)}`);

export const _talNum = (talon, tpl = '') => tpl ? 
  _tplName(talon) :
  m('legend', `Талон № ${_number(talon.tal_num)}`,
    m('span', 
      { style: "padding: 3em" }, 
      _editable(talon.talon_type),
       `Год ${states().year}`
    )
  );


