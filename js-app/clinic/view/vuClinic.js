
// src/clinic/view/vuClinic.js

import { moCard } from '../model/moCards.js';
import { moTalonsList, moTalon } from '../model/moTalons.js';

export const vuClinic = function(vnode) {
  return {
    oninit: function(vnode) {
      // init optons data
      //if ( !Boolean(moCard.data) ) moCard.getOptions();
      //if ( !Boolean(moTalon.data) ) moTalon.getOptions();
    },
    view: function(vnode) {
      return m('div', {
          style: "margin: 0 auto; padding-top: 5em; width: 50%;"
        },
      /*
      m(".pure-g", [
        m(".pure-u-1-6",
          m("a.pure-button.pure-button-primary",
            { href: "#!/new-card", style: "font-size: 1.2em; font-weight: 600" }, "Карта"),
        ),
        m(".pure-u-1-6",
          m('a.pure-button.pure-button-primary',
            { href: "#!/new-talon", style: "font-size: 1.2em; font-weight: 600" }, "Талон"),
        )
      ]),
      */
        m('h1.blue', {style: "font-size: 3em;"}, vnode.attrs.text)
      );
    }
  }
}

export const getFIO= s=> {
   let f= ['fam', 'im', 'ot'].map(k=> s[k]? s[k]: '');
   return `${f[0]} ${f[1]} ${f[2]}`;
}

export const _Num= num=> num ? num: ''; //talon number

//talon editable
export const _notEdit= tal=> {
  // 0- deleted 1- open (may edit) 2- closed
  if (tal.talon_type === null || tal.talon_type === 1)
    // same year may edit
    if( moTalonsList.year == moTalonsList._year )
      return false; // may edit
  return true;
};

export const talNum= tal=> 
  m('legend', `Талон № ${_Num(tal.tal_num)}`,
    m('span', {style: "padding: 3em"}, _notEdit(tal) ? 'закрыт': 'открыт') , `Год ${moTalonsList._year}`);
  
  