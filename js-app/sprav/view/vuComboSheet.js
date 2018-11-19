// src/sprav/view/vuComboSheet.js

//import { moModel } from '../../apps/model/moModel.js';
//import { vuDialog } from '../../apps/view/vuDialog.js';
import { vuTheader } from './vuSprav.js';

// clojure
const vuComboSheet = function (vnode) {
  
  let modelObject = vnode.attrs.model, // model Object
    headerString = vnode.attrs.header, // String: page header 
    listMap = vnode.attrs.listMap, // list mapping function
    findForm = vnode.attrs.findForm, // form to find
    //nameString = vnode.attrs.name, // String: models item name
    filterForm = vnode.attrs.filter, //
    structObject = vnode.attrs.struct; // the struct Object
  let init = true;
  return {
    
  oninit () {
    //moModel.getList( vnode.attrs.model );
    //moModel.getData( vnode.attrs.model );
  },
  /*
  oncreate() {
  },
  */
  onbeforeupdate(vnode) {
    init = false;
  },

    view: function () {

      //return m(tableView, {model: this.model , header: this.header }, [
      return [
        m(vuTheader, {header: headerString}),
        m(findForm, {model: modelObject}),
        init ? m('h1.blue', {style: "font-size: 1.2em;"}, 'Выбрать диагноз и стадию') :
          modelObject.error ? [m(".error", modelObject.error)] :
            modelObject.list ? [
              modelObject.list[0] ? [
                //m(vuFind, {cols: findInt} ),
                m(filterForm),
                m('table.pure-table.pure-table-bordered[id=find_table]', [
                  m('thead', [
                    m('tr', [
                      Object.keys(structObject).map( (column) => {
                        return m('th', structObject[column][0]);
                        }
                      ) // not sorted
                    ]),
                  ]),
                  m('tbody', [modelObject.list.map(listMap)])
                ])
              ] : m('h1.blue', {style: "font-size: 1.2em;"}, "Нет таких записей")
            ] : m(".loading-icon", [
              m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
              m('span.sr-only', 'Loading...')
            ])
        ];
    }
  }; //return this object
}

export { vuComboSheet };