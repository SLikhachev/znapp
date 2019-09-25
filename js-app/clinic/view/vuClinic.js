
// src/clinic/view/vuClinic.js

import { moCard } from '../model/moCards.js';
import { moTalon } from '../model/moTalons.js';

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
