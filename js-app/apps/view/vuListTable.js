
// src/sprav/view/vuListTable.js

import { checkArray } from '../utils';
import { disp } from '../appApi';
import { idName } from '../defines/defStruct';
import { vuDialog } from './vuDialog';

// change list item in Dialog window 
const onchange = (method, word) => e => {
  disp(['change', method, word, e.target.getAttribute('data')]);
  vuDialog.open();
};
export const onedit = onchange('PATCH', "Изменить");
export const ondelet = onchange('DELETE', "Удалить");
export const onadd = e => {
  e.preventDefault();
  disp(['add'])
  vuDialog.open();
};

export const editItem = (row, key, pk) => ([
  row[key],
  '.choice.blue',
  { data: row[pk], onclick: onedit }
]);

export const deletItem = (row, key, pk) => m('i.fa.fa-minus-circle.choice.red',
  { data: row[pk], onclick: ondelet });

export const linkItem = (row, key, pk) => ([
  m(m.route.Link, { href: `${m.route.get()}/${row[pk]}` }, row[key]),
  '.choice.blue',
]);


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
  //const edit = itdef.editable && (itdef.editable.indexOf('edit') >= 0);
  //const delet = itdef.editable && (itdef.editable.indexOf('del') >= 0);
  //const href = itdef.href ? `${m.route.get()}` : '';
  /*
  const rval = (row, key, fn) =>
    fn && (typeof fn === 'function') ? fn(row, key) : row[key];
  */
  /*
  const first_cell = (el, rd) => {
    const [k, n] = el, pk = rd[pki],
      _rval = rval(rd, k, _fn(n));

    if (href)
      return m('td.choice.blue', m(m.route.Link,
        { href: `${href}/${pk}` }, _rval));

    const attrs = { data: pk };
    if (edit)
      attrs.onclick = onedit;

    return m('td.choice.blue', attrs, _rval);
  }

  const _cell = (el, rd) => {
    let [k, n] = el;
    return m('td', rval(rd, k, _fn(n)));
  }
  */
  const $cell = (el, rd) => {
    let [k, rep] = el,
      [value, klass = '', attrs = {}] = rval(rd, k, rep, pk);
    return m(`td${klass}`, attrs, value);
  }

  //const cell = (el, ix, rd) => ix === 0 ? first_cell(el, rd) : _cell(el, rd);

  //const cell = (el, ix, rd) => $cell(el.rd);

  //const ddisplay = () => delet ? 'display: table-cell' : 'display : none';

  const columns = Object.entries(struct);

  return row => m('tr', { key: row[pk] },
    columns.map(el => $cell(el, row))
    //columns.map((el, ix) => $cell(el, ix, row)),
    //m('td', { style: ddisplay() }, m('i.fa.fa-minus-circle.choice.red',
    //  { data: row[pki], onclick: ondelet })
    //)
  );
}

// clojure
export const vuListTable = function (vnode) {

  const {
    table_class = '.pure-table.pure-table-bordered',
    table_id = 'list_table',
  } = vnode; // call as func not as component

  let itdef = {}, struct = {}, list = [];

  const sort = e => disp(['sort', e.target.getAttribute('data')]);

  const column = el => {
    let [k, rep] = el, [name, s = ''] = _rep(rep);
    return s === 'sort' ? // sortable column has 2nd elem in array
      m('th.sortable', { data: k, onclick: sort }, name, m('i.fa.fa-sort.pl10')) :
      m('th', name);
  };
  //let listRow = tableRow();
  /*
  const ddisplay = d =>
    d.editable && (d.editable.indexOf('del') >= 0) ?
      'display: table-cell' : 'display: none';
  */
  const table = `table${table_class}[id=${table_id}]`;

  return {
    view(vnode) {
      ({ itdef, list } = vnode.attrs);
      struct = itdef.struct || idName;
      listMap = tableRow({ itdef });

      return m(table, { style: 'margin-top: 2em;' }, [
        m('thead', m('tr', [
          Object.entries(struct).map(el => column(el)),
          //m('th', { style: ddisplay(itdef) }, "Удалить")
        ])),
        m('tbody', [list.map(listMap)])
      ]);
    }
  };
}
