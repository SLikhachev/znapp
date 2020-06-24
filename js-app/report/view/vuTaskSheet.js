// src/sprav/view/vuTaskSheet.js

import { vuLoading, vuTheader } from '../../apps/view/vuApp';
import { states } from '../../apps/appApi'; //stream
import { vuListTable } from '../../apps/view/vuListTable';
import { vuTaskForm } from '../form/taskForm';
import { vuTaskFormChildren } from '../form/vuTaskChildren';



// clojure
export const vuTaskSheet = function () {
  /**
  */
  //closure
  let item = '', defs = {}, def = {}, itdef = {}, task = {};
  const vuTable = vuListTable({ itdef, list: states().list });

  return {
    view(vnode) {
      //console.count('sheet view');
      ({ item } = vnode.attrs); //string from router resolver
      defs = states().suite || {};
      def = defs[item] || {};
      itdef = def.item || {};
      task = def.task || {};

      return [
        m(vuTheader, { itdef }),
        m(vuTaskForm, { task },
          m(vuTaskFormChildren, { task })
        ), // make list [] manually
        states().error ? m(".error", states().error) :
          !states().list ? m(vuLoading) : [
            m(vuTable, { itdef, list: states().list }),
          ]
      ]
    }
  }; //return this object
}
