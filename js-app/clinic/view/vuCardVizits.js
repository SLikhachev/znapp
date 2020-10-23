

import { states, disp } from '../../apps/appApi';
import { vuListTable } from '../../apps/view/vuListTable';
import { talonPath } from '../defines/defTalons';


export const crdVizits = function (vnode) {
  
  let itdef, list = [], card;

  const vuTable = vuListTable({ itdef, list });

  return {
    view(vnode) {
      ({ card } = states());  
      itdef = states().suite.talons.item || {};
      list = states().data.get('talons') || [];

      //console.log('talPara view');
      return [
        m('.pure-g', 
          m('.pure-u-1-1', 
            m('h2', 'Визиты в текущем году'),
            m(vuTable, { itdef, list })
        )),
        m('.pure-g', !card ? '' : m('.pure-u-1-3',
          m(m.route.Link, {
            selector: 'a.pure-button.pure-button-primary',
            href: talonPath(card, 'add'),
            style: "float: right; margin-top: 2em; font-size: 1.3 em"
          }, "Добавить талон")
        ))
      ]; // return
    } // view
  }; // return
};
