
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
  //if (tal.talon_type === null || tal.talon_type === 1)
    // talon of the same year may edit
    // case of 1. mek else we can not send it twice in same year
    // same year may edit
    if ( ( moTalonsList.year == moTalonsList._year ) && (tal.talon_type == 1 ) )
      //console.log(tal.tal_num, tal.talon_type);
      return false; // may edit
  return true;
};

const _Name = name=> name ? name: 'новый';
const tplName = (tal) => m('legend', `Шаблон ${_Name(tal.crd_num)}`);

export const talNum= function(tal, tpl='') { 
  return tpl ? tplName(tal) :
    m('legend', `Талон № ${_Num(tal.tal_num)}`,
      m('span', {style: "padding: 3em"}, _notEdit(tal) ? 'закрыт': 'открыт') , `Год ${moTalonsList._year}`
  );
}

String.prototype.transLit = String.prototype.translit || function () {
    const rus = 'ЙЦУКЕНГШЩЗФЫВАПРОЛДЯЧСМИТЬ';
    const eng = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    let i = rus.indexOf(this);
    if ( i < 0 )  return this;
    return eng[ i ];
  };
  
export const dupper = s=> s.length > 0 ? s.charAt(0).toUpperCase().transLit() + s.substring(1): s;
export const upper = s=> s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();

