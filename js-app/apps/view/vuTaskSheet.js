// src/apps/view/vuTaskSheet.js

// USED BY reestr app

import { states } from '../appApi'; //stream
import { vuTaskForm } from '../form/taskForm';
import { vuTaskFormChildren } from '../form/vuTaskChildren';
import { vuLoading, vuTheader } from './vuApp';
import { vuListTable } from './vuListTable';

// clojure
export const vuTaskSheet = function () {

  let item = '', defs = {}, def = {}, itdef = {}, task = {};
  const vuTable = vuListTable({ itdef, list: states().list });
  const subHdr = text => text && text.file_name ?
    m('h4', `Последний файл ${text.file_name}`) : '';

  return {
    view(vnode) {
      //console.count('sheet view');
      ({ item } = vnode.attrs); //string from router resolver
      defs = states().suite || {};
      def = defs[item] || {};
      itdef = def.item || {};
      task = def.task || {};
      rest = def.rest || {};

      return [
        m(vuTheader, { itdef }),
        subHdr(states().count),
        m(vuTaskForm, { task },
          m(vuTaskFormChildren, { task })
        ), // make list [] manually
        states().error ? m(".error", states().error) :
          !rest.url ? '' :
            !states().list ? m(vuLoading) :
              m(vuTable, { itdef, list: states().list }),
      ];
    }
  }; //return this object
};
