

import { states, disp } from '../../apps/appApi';
import { vuListTable } from '../../apps/view/vuListTable';
//import { linkTalon } from '../defines/defCards';


export const crdVizits = function (vnode) {

  //let crd;
  //if (vnode.attrs.model.card.length > 0)
  //  crd = vnode.attrs.model.card[0].crd_num;
  //else
  //  crd = '';
  //console.log(crd);
  //let tal = vnode.attrs.model.talons ? vnode.attrs.model.talons : [];
  // tal_num int, open_date date, close_date date, purp smallint,
  //doc_spec int , doc_code int, family varchar,  ds1 varchar
  
  let itdef, list = [];

  const vuTable = vuListTable({ itdef, list });

  return {
    /*
    listMap(s) {
      return m('tr', [
        Object.keys(tal_hdr).map(column => {
          let td = tal_hdr[column].length === 2 ?
            m('td.choice.blue', m(m.route.Link, {
              href: `${clinicApi.talons}/${s[column]}/${crd}`,
            }, s[column])) : m('td', s[column]);
          return td;
        })
      ]);
    },
    */  
    view(vnode) {
      
      itdef = states().suite.talons.item;
      list = states().data.get('talons') || [];

      //console.log('talPara view');
      return [
        m('.pure-g', 
          m('.pure-u-1-1', 
            m('h2', 'Визиты в текущем году'),
            m(vuTable, { itdef, list })
        )),
        m('.pure-g', m('.pure-u-1-3',
          m(m.route.Link, {
            selector: 'a.pure-button.pure-button-primary',
            href: '#', //`${[clinicApi.talon_add]}${crd}`,
            style: "float: right; margin-top: 2em; font-size: 1.3 em"
          }, "Добавить талон")
        ))
      ]; // return
    } // view
  }; // return
};
