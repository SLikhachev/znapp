
// src/sprav/view/dsTNM.js

import { moModel } from '../../apps/model/moModel.js';
import { restSprav } from '../spravApi.js';
import { moStruct } from '../model/moStruct.js';

const dsFind = function (vnode) {

  //let model = vnode.attrs.model;
  let on_submit = function (event) {
    // button FIND click event handler callback
    event.preventDefault();
    let data = moModel.getFormData( $('form#ds_find') );
    //console.log ( data );
    //return false;
    //data.lim = 50;
    //data.offs = 1;
    moModel.getViewRpc(
      vnode.attrs.model,
      data
    );
    //m.redraw();
    return false;
  };

  return {

    oninit(vnode) {
      vnode.attrs.model.method='POST';
      vnode.attrs.model.url =restSprav.onko_n6.url;
    },

    view(vnode) {

      return m(".pure-g",
        m(".pure-u-1-2",
          m("form.pure-form[id=ds_find]",
            m("fieldset",
              m(".pure-g", [
                m(".pure-u-1-5",
                  m("input.input-find.pure-u-3-4[name=ds][type='search']",
                    {
                      placeholder: "Диагноз",
                      //onkeyup: m.withAttr("value", (c => c.toUpperCase()) ),
                      //value: vmFind.toFind
                    }
                  )
                ),
                m(".pure-u-1-5",
                  m("input.input-find.pure-u-3-4[name=stady][type='search']",
                    {placeholder: "Стадия (число)"}
                  )
                ),
                m(".pure-u-1-5",
                  m('button.pure-button.pure-button-primary[type="button"]', {
                      //value: 0,
                      onclick: on_submit
                    },
                    "Выбрать"
                  )
                ),
              ])
            )
          )
        )
      );
    }
  }
};


const listTnm = function (s) {
  let first = true;
  return m('tr', [
    Object.keys(moStruct.onko_n6).map( (column) => {
      let cell;
      switch (column) {
        case 'ds_code': cell = s[column];
          break;
        case 'stady_id': cell = `${s['stady_id']}. ${s['st_kod']}`;
          break;
        case 'tumor_id': cell = `${s['tumor_id']}. ${s['tm_kod']}`;
          break;
        case 'nodus_id': cell = `${s['nodus_id']}. ${s['nd_kod']}`;
          break;
        case 'metas_id': cell = `${s['metas_id']}. ${s['meta_kod']}`;
          break;
        default: cell = 'NULL'
      }
      let td = first ? m('td.choice.blue', cell) : m('td', cell);
      first = false;
      return td;
    })
  ])
};

const vmFind = {

  toFind: "",
  inCol: {tumor_id:3, nodus_id:4, metas_id: 5 },

  find(event) {
    let id = event.target.id
    vmFind.toFind = event.target.value.toLowerCase();
    let col = vmFind.inCol [ id ];
    $.each($('table#find_table tbody tr'), function (ind, tr) {
      let subtr = $(tr).children().slice(col - 1, col);
      //console.log( subtr );
      if (subtr.text().toLowerCase().indexOf(vmFind.toFind) === -1) {
        $(tr).hide();
      } else {
        $(tr).show();
      }
      m.redraw();
    });
  }
}

const tnmFilter = {

  oninit(vnode) {
    vmFind.toFind = "";
  },

  view (vnode) {
    return m(".pure-g",
      m(".pure-u-1-2", [
        m('span.blue', {style: "font-size: 1em"}, "Найти в колонках "),
        m("form.pure-form",
          m("fieldset",
            m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[id='tumor_id'][type='search']",
                  {placeholder: "Tumor",
                  onkeyup: vmFind.find,
                  //value: vmFind.toFind
                  }
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[id='nodus_id'][type='search']",
                  {placeholder: "Nodus",
                  onkeyup: vmFind.find,
                  //value: vmFind.toFind
                  }
                )
              ),
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[id='metas_id'][type='search']",
                  {placeholder: "Метас",
                  onkeyup: vmFind.find,
                  //value: vmFind.toFind
                  }
                )
              ),
            ])
          )
        ),
      ])
    );
  }
}

export { dsFind, listTnm,  tnmFilter}