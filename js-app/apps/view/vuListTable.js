
// src/sprav/view/vuListTable.js

import { disp } from '../appApi';
import { idName } from '../defines/defStruct';
import { checkArray } from '../model/moModel';
import { vuDialog } from './vuDialog';

const nfn = v => v.th || v || ['unknown']; // object with th or just list
const _fn = n => checkArray(nfn(n)) ? nfn(n)[1] : null;


const tableRow = () => {

  const onchange = (method, word) => e => {
    disp(['change', method, word, e.target.getAttribute('data')]);
    vuDialog.open();
  };
  const onedit = onchange('PATCH', "Изменить");
  const ondelet = onchange('DELETE', "Удалить");

  return data => {
    // data Object { itdef } object for row representation 
    //console.log(data);
    const { itdef } = data;
    let pki = itdef.pk || 'id';

    const struct = itdef.struct || idName;
    const edit = itdef.editable && (itdef.editable.indexOf('edit') >= 0);
    const delet = itdef.editable && (itdef.editable.indexOf('del') >= 0);
    const href = itdef.href ? `${m.route.get()}` : '';

    const rval = (val, fn) =>
      fn && (typeof fn === 'function') ? fn(val) : val;

    const first_cell = (el, rd) => {
      const [k, n] = el, val = rd[k], pk = rd[pki],
        _rval = rval(val, _fn(n));

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
      return m('td', rval(rd[k], _fn(n)));
    }

    const cell = (el, ix, rd) => ix === 0 ? first_cell(el, rd) : _cell(el, rd);

    const ddisplay = () => delet ? 'display: table-cell' : 'display : none';

    const columns = Object.entries(struct);

    return row => m('tr', { key: row[pki] }, [
      columns.map((el, ix) => cell(el, ix, row)),
      m('td', { style: ddisplay() }, m('i.fa.fa-minus-circle.choice.red',
        { data: row[pki], onclick: ondelet })
      )
    ]);
  }
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
    let [k, v] = el, [name, s] = nfn(v);
    return s === 'sort' ? // sortable column has 2nd elem in array
      m('th.sortable', { data: k, onclick: sort }, name, m('i.fa.fa-sort.pl10')) :
      m('th', name);
  };
  let listRow = tableRow();

  const ddisplay = d =>
    d.editable && (d.editable.indexOf('del') >= 0) ?
      'display: table-cell' : 'display: none';

  const table = `table${table_class}[id=${table_id}]`;

  return {
    view(vnode) {
      ({ itdef, list } = vnode.attrs);
      struct = itdef.struct || idName;
      listMap = listRow({ itdef });

      return m(table, [
        m('thead', m('tr', [
          Object.entries(struct).map(el => column(el)),
          m('th', { style: ddisplay(itdef) }, "Удалить")
        ])),
        m('tbody', [list.map(listMap)])
      ]);
    }
  };
}
