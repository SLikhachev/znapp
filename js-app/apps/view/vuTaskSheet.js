// src/apps/view/vuTaskSheet.js

'use strict';

// USED BY reestr app

import { states } from '../appApi'; //stream
import { vuTaskForm } from '../form/taskForm';
import { vuTaskFormChildren } from '../form/vuTaskChildren';
import { vuLoading, vuTheader } from './vuApp';
import { vuListTable } from './vuListTable';

// clojure
export const vuTaskSheet = function () {

  let item = '',
    defs = {}, def = {}, itdef = {},
    task = {}, rest = {};

  const vuTable = vuListTable({ itdef, list: states().list });

  const count_field = it => it.count_field || 'file_name';
  const count_text = it => it.count_text || "Последний файл ";

  const subHdr = info => info && info[count_field(itdef)] ?
    m('h4', `${count_text(itdef)}${info[count_field(itdef)]}`) : '';

  return {
    view(vnode) {
      //console.count('sheet view');
      ({ item } = vnode.attrs); //string from router resolver
      defs = states().suite || {};
      def = defs[item] || {};
      ({ task={}, rest={} } = def);
      itdef = def.item || {};

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
