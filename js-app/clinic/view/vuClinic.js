
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


export const _Num = num => num ? num : ''; //talon number

//talon editable
export const _notEdit = tal => {
  // 0- deleted 1- open (may edit) 2- closed
  //if (tal.talon_type === null || tal.talon_type === 1)
  // talon of the same year may edit
  // case of 1. mek else we can not send it twice in same year
  // same year may edit
  if ((moTalonsList.year == moTalonsList._year) && (tal.talon_type == 1))
    //console.log(tal.tal_num, tal.talon_type);
    return false; // may edit
  return true;
};

const _Name = name => name ? name : 'новый';
const tplName = (tal) => m('legend', `Шаблон ${_Name(tal.crd_num)}`);

export const _talNum = function (tal, tpl = '') {
  return tpl ? tplName(tal) :
    m('legend', `Талон № ${_Num(tal.tal_num)}`,
      m('span', { style: "padding: 3em" }, _notEdit(tal) ? 'закрыт' : 'открыт'), `Год ${moTalonsList._year}`
    );
};

export const talNum = tal => m('legend', 
  `Талон № `, 
  m('span', { style: "padding: 3em" }, 'закрыт'), 
  `Год `
);


