
// src/sprav/view/vuListTable.js

import { checkArray } from '../utils';
import { disp } from '../appApi';
import { idName } from '../defines/defStruct';


// object with th or just list
// th prop of object || array ref || dummy
const _rep = el => el.th || el || ['unknown'];

// 3rd elem may be function if any
const _fn = el => checkArray(_rep(el)) ? _rep(el)[2] : null;

// func must return array [value, class, attrs]
const rval = (row, key, rep, pk) => {
  let rv = row[key], fn = _fn(rep);
  if (fn && (typeof fn === 'function'))
    rv = fn(row, key, pk);
  return checkArray(rv) ? rv : [rv];
}

const tableRow = data => {
  // data Object { itdef } object for row presentation 
  //console.log(data);
  const { itdef } = data;
  let pk = itdef.pk || 'id';

  const struct = itdef.struct || idName;

  const $cell = (el, rd) => {
    let [k, rep] = el,
      [value, klass = '', attrs = {}] = rval(rd, k, rep, pk);
    return m(`td${klass}`, attrs, value);
  };

  const columns = Object.entries(struct);

  return row => m('tr', { key: row[pk] },
    columns.map(el => $cell(el, row))
  );
};

// clojure
export const vuListTable = function (vnode) {

  const {
    table_class = '.pure-table.pure-table-bordered',
    table_id = 'list_table',
  } = vnode; // call as func not as component

  let itdef = {}, struct = {}, list = [];

  // we need sort here only  
  const sort = e => disp(['sort', e.target.getAttribute('data')]);

  const column = el => {
    let [k, rep] = el, [name, s = ''] = _rep(rep);
    return s === 'sort' ? // sortable column has 2nd elem in array
      m('th.sortable', { data: k, onclick: sort }, name, m('i.fa.fa-sort.pl10')) :
      m('th', name);
  };
  const table = `table${table_class}[id=${table_id}]`;

  return {
    view(vnode) {
      ({ itdef, list } = vnode.attrs);
      struct = itdef.struct || idName;
      listMap = tableRow({ itdef });

      return m(table, { style: 'margin-top: 2em;' }, [
        m('thead', m('tr',
          Object.entries(struct).map(el => column(el)),
        )),
        m('tbody', [list.map(listMap)])
      ]);
    }
  };
};
