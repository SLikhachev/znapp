
// src/sprav/view/vuListTable.js

import { vuDialog } from '../../apps/view/vuDialog';
import { disp } from '../../apps/appApi';
import { idName } from '../defines/defStruct';
//import { saveResult } from '../model/moModel';

const tableRow = () => {

  const onchange = (method, word) => e => {
    disp(['change', method, word, e.target.getAttribute('data')]);
    //saveResult({});
    vuDialog.open();
  };
  const onedit = onchange('PATCH', "Изменить");
  const ondelet = onchange('DELETE', "Удалить");

  return data => {
    // data Object { itdef } object for row representation 
    //console.log(data);
    const { itdef } = data;
    let pki = itdef.pk || 'id';
    //itemPk(itdef.pk || 'id');

    const struct = itdef.struct || idName;
    const edit = itdef.editable && (itdef.editable.indexOf('edit') >= 0);
    const delet = itdef.editable && (itdef.editable.indexOf('del') >= 0);
    const href = itdef.href ? `${m.route.get()}` : '';

    const first_cell = (col, row, href) => {
      const pk = row[pki];

      if (href)
        return m('td.choice.blue', m(m.route.Link,
          { href: `${href}/${pk}` }, row[col]));

      const attrs = { data: pk };
      if (edit)
        attrs.onclick = onedit;

      return m('td.choice.blue', attrs, row[col]);
    }

    const ddisplay = () => delet ? 'display: table-cell' : 'display : none';

    return row => {
      let columns = Object.keys(struct);

      return m('tr', { key: row[pki] }, [
        first_cell(columns[0], row, href),
        columns.slice(1).map(column => m('td', row[column])),
        m('td', { style: ddisplay() }, m('i.fa.fa-minus-circle.choice.red',
          { data: row[pki], onclick: ondelet })
        )
      ]);
    };
  };
};

// clojure
export const vuListTable = function (vnode) {

  const {
    table_class = '.pure-table.pure-table-bordered',
    table_id = 'list_table',
  } = vnode; // call as func not as component

  let itdef = {}, struct = {}, list = [];

  const sort = e => disp(['sort', e.target.getAttribute('data')]);

  const column = c => {
    let f = struct[c].th || struct[c] || ['unknown']; // object with th or just list

    if (f.length > 1) // sortable column has 2nd elem in array
      return m('th.sortable', { data: c, onclick: sort }, f[0],
        m('i.fa.fa-sort.pl10'));

    return m('th', f[0]);
  };
  let listRow = tableRow();

  const ddisplay = () => {
    if (itdef.editable && (itdef.editable.indexOf('del') >= 0))
      return 'display: table-cell';
    return 'display: none';
  }

  const table = `table${table_class}[id=${table_id}]`;

  return {
    view(vnode) {
      ({ itdef, list } = vnode.attrs);
      struct = itdef.struct || idName;
      listMap = listRow({ itdef });

      return m(table, [
        m('thead', m('tr', [
          Object.keys(struct).map(col => column(col)),
          m('th', { style: ddisplay() }, "Удалить")
        ])),
        m('tbody', [list.map(listMap)])
      ]);
    }
  };
}
