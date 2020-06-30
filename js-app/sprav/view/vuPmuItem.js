
// src/sprav/view/vuPmuItem.js

import { states, disp } from '../../apps/appApi';
import { changedItem } from '../../apps/model/moListItem';
import { vuItemFormChildren } from '../../apps/form/vuItemChildren';
import { makeTags } from '../../apps/form/makeTags';
import { vuForm } from '../form/spravForm';


// current key to delete from `pmu_grup_code`
// if this is code_usl in several groups then id of grup, else code_usl 
const keys = ['id', 'code_usl']
const delkey = () => states().unit === 'pmus' ? 0 : 1;

const grupPmuForm = () => {

  let code_usl = '';
  const grup = m.stream('');
  const oninput = e => grup(e.target.value);
  const onsubmit = e => {
    e.preventDefault();
    //console.log(code_usl, grup());
    disp(['pmugrup', code_usl, grup(), 'POST']);
    return false;
  };

  const tags = makeTags({
    grup: {
      th: [''],
      label: ['Добавить к группе'],
      tag: ['.pure-u-3-4', 'required'],
      type: 'number',
      attrs: { value: grup, oninput }
    }
  });

  return {
    view(vnode) {
      ({ code_usl } = vnode.attrs);

      return [
        m(".pure-g",
          m(".pure-u-1-1",
            m("form.pure-form", { onsubmit },
              m("fieldset", m(".pure-g", [
                m(".pure-u-1-3", tags('grup', 0)),
                m(".pure-u-1-3",
                  m('button.pure-button.pure-button-primary[type="submit"]',
                    { style: 'margin-top: 1.7em' }, "Добавить")
                )
              ]))
            )//form
          ) // u-1-2
        ), // g
        m('.pure-g',
          m(".pure-u-1-1",
            m('span#card_message',
              states().saverror ? m('span.red', states().saverror) : '')
          )
        )
      ];
    }// g return
  }
}// view


const vuPmuGrups = function () {

  let grups = [], struct = {}, item;

  // disp accept params ( code_usl, grup, method )
  const ddel = e => {
    e.preventDefault();
    const dk = delkey();
    const act = ['pmugrup'];
    // delele usl from grup
    if (keys[dk] === 'id') {
      act.push(item.code_usl);
      act.push(e.target.getAttribute('data'));
    } else {
      act.push(e.target.getAttribute('data'));
      act.push(item.id);
    }
    //console.log(act);
    act.push('DELETE')
    disp(act);
    return false;
  };

  const tcol = c => {
    let f = struct[c].th || struct[c] || ['unknown'];
    return m('th', f[0]);
  };

  // in both case (cide_usl, grup) row must have the id field
  // if code_usl is constatnt: id will be grup id
  // else if grup id is constant: id will be code_usl id
  // key param here is needed only for mithril render
  const trow = r => m('tr', { key: r.id }, [
    Object.keys(struct).map(c => m('td', r[c])),
    m('td', m('i.fa.fa-minus-circle.choice.red',
      { data: r[keys[delkey()]], onclick: ddel })
    )
  ]);
  const tbl_struct = () => states().unit === 'pmus' ? 'usl_grup' : 'grup_usl';
  const tbl_hdr = () => ({
    usl_grup: 'ПМУ Включена в группы',
    grup_usl: 'В группу включены ПМУ'
  }[tbl_struct()]);


  return {
    view(vnode) {
      struct = states().suite[tbl_struct()].item.struct || {};
      grups = [];
      if (states().options)
        grups = states().options.get(tbl_struct()) || [];
      ({ item } = vnode.attrs);

      return [
        m('h2', tbl_hdr()),
        tbl_struct() === 'usl_grup' ?
          m(grupPmuForm, { code_usl: item.code_usl }) : '',
        m('table.pure-table.pure-table-bordered', [
          m('thead', m('tr', [
            Object.keys(struct).map(col => tcol(col)),
            m('th', "Удалить")
          ])),
          m('tbody', grups.map(trow))
        ])
      ];
    }
  };
}


export const vuPmu = function () {

  let defs, def, itdef;
  const name = () => item.name ? item.name : 'Без названия'

  const hdr = item => m('h2',
    `${item[keys[delkey() ^ 1]]} ${name()}`);

  return {
    view() {
      defs = states().suite || {};
      def = defs[states().unit] || {};
      itdef = def.item || {};
      item = changedItem() || {};

      return m('.pure-g', [
        m('.pure-u-1-2', [
          hdr(item),
          m(vuForm, { word: states().word, itdef },
            m(vuItemFormChildren, { itdef })
          )
        ]),
        m('.pure-u-1-2', [
          m(vuPmuGrups, { item })
        ])
      ]);
    }
  };
}
