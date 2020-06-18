// src/sprav/view/vuSheet.js

//import { moList, changeEvent } from '../model/moModel'; //streams
import { vuLoading, vuTheader } from '../../apps/view/vuApp';
import { vuDialog } from '../../apps/view/vuDialog';
import { states } from '../../apps/appApi'; //stream
import { vuFindForm, vuForm, vuFetchForm } from '../form/spravForm';
import { vuItemFormChildren } from '../form/vuItemChildren';
import { vuFetchFormChildren } from '../form/vuFetchChildren';
import { vuListTable } from './vuListTable';


// clojure
export const vuSheet = function (vnode) {
  /**
   * item sprav - definition item name from struct
   * def_obj - object of all items definition (currentSet)
   * itdef - current item definition object (currentItem)
   */
  //let { item } = vnode.attrs; //streams ref
  //let defs = states().suite || {};
  //let def = defs[item] || {};
  //let itdef = def.item || {};
  //console.count(`vuSheet closure ${item}`);
  //closure
  let item = '', word = '', defs = {}, def = {}, itdef = {};
  const vuTable = vuListTable({ itdef, list: states().list });

  return {
    view(vnode) {
      //console.count('sheet view');
      ({ item } = vnode.attrs); //string from router resolver
      defs = states().suite || {};
      def = defs[item] || {};
      itdef = def.item || {};
      word = states().word || '';

      return [
        m(vuTheader, { itdef }),
        m(vuFetchForm, { def }, // there add item button
          m(vuFetchFormChildren, { def })
        ),
        states().error ? m(".error", states().error) :
          !states().list ? m(vuLoading) : [
            m(vuFindForm, { itdef }),// there add item button
            m(vuTable, { itdef, list: states().list }),
            m(vuDialog, { itdef, word },
              m(vuForm, { itdef, word },
                m(vuItemFormChildren, { itdef }))
            )
          ]
      ]
    }
  }; //return this object
}
