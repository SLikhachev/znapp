// src/sprav/view/vuSprav.js

import { vuMain } from '../../apps/view/vuMain.js';
import { vuDialog } from '../../apps/view/vuDialog.js';
import { spravMenu } from '../spravApi.js';
//import { moModel } from '../model/moModel.js';

// Forms in dialog window for catalogs 
const vuForm = {
  
  item: null,
  method: "",
  word: "",
  model: null,
  name: "",
  
  oninit(vnode) {
    vuDialog.model = vnode.attrs.model;
    vuForm.model = vnode.attrs.model;
    vuForm.name = vnode.attrs.name;
  },
    
  view(vnode) {
    //let item = vuForm.item,
    let method = vuForm.method,
    word = vuForm.word;
    
    return m('form.pure-form.pure-form-aligned',
      { id: 'moform',
        oncreate: vuDialog.fvalid //, 
      }, [
        vnode.children,
        m('.pure-controls', [
            m('input[type=hidden][name=method]', {value: method} ),
            m('button.pure-button[type=submit]', word),
        ])
      ] );
  },
  getItem(id) {
    let list = this.model.list;
    return id ? _.find( list, (i) => { return i.id == id; } ) : null;
  }, 
    
  dput (id) { // add or edit item
    if ( id == "0" ) { // new item add
      vuForm.method = "POST";
      vuForm.word = "Добавить";
      vuForm.item = null;
    } else {  // edit item
      vuForm.method = "PATCH";
      vuForm.word = "Изменить";
      vuForm.item = vuForm.getItem(id);
    }  
    vuDialog.open();
    return false;
  },
  
  ddel(id) { // delete item
    vuForm.method = "DELETE";
    vuForm.word = "Удалить";
    vuForm.item = vuForm.getItem(id);
    vuDialog.open();
    return false;
  },
  
  types() { // debug output
    console.log(this.item);
    console.log(this.method);
    console.log(this.word);
  }
}
/*
const vuPanel = {
    
  view (vnode) {
    return m('.panel', [
      m('div', m('span.dheader', vnode.attrs.header )),
      m('div', m('button.pure-button-cust', {
          value: 0,
          onclick: m.withAttr( "value", vuForm.dput)
        }, 'Добавить')
      ),
      m('div', m('form.pure-form', [
          m('input[type=text].pure-input', {placeholder: 'Поиск'}),
          m('select.ml10', [
            m('option[value=0]', 'На этой странице'),
            m('option[value=1]', 'В базе данных')
          ]),
          m('button.pure-button.ml10', 'Найти')
        ])
      )
    ]);
  },
  
}
*/
const vuTheader = {
  view (vnode) {
    return m(".pure-g",
      m(".pure-u-1-1.box-1",
        m('span.dheader', vnode.attrs.header )
      )
    );
  }
}

const vmFind = {
  
  trCols: 2, // how many tr childern (table columns) get to find 
  toFind: "",
  setFind: function(str) {
    vmFind.toFind = str.toLowerCase();
    $.each( $('table#find_table tbody tr'), function(ind, tr) {
      let subtr = $(tr).children().slice(0,vmFind.trCols);
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

const vuFind = {
  
  oninit(vnode) {
    vmFind.trCols = vnode.attrs.cols ? vnode.attrs.cols : 2;
    vmFind.toFind = "";
  },
  
  view (vnode) {
    return m(".pure-g",
      m(".pure-u-1-1",
        m("form.pure-form",
          m("fieldset",
            m(".pure-g", [
              m(".pure-u-1-5",
                m("input.input-find.pure-u-3-4[id='to-find'][type='search']",
                  {placeholder: "найти число, слово",
                  onkeyup: m.withAttr("value", vmFind.setFind ),
                  value: vmFind.toFind
                  }
                )
              ),
              /*
              m(".pure-u-1-5",
                m("input.input-find.pure-u-2-3[id=name-find[type='text']",
                  {placeholder:"наименование"}
                )
              ),
              */
              m(".pure-u-1-5",
                vnode.attrs.addButton ? 
                m('button.pure-button.pure-button-primary[type="button"]', {
                    value: 0,
                    onclick: m.withAttr( "value", vuForm.dput)
                  },
                "Добавить"
                ) : ''
              )
            ])
          )
        )
      )
    );
  }
}
/*
const vuLoading = {
 
    oninit: function (vnode) {
      console.log(vnode.attrs.model);
    },
    
    view: function (vnode) {
      console.log(vnode.attrs.model);
      return m('div', "HER");
      
      return vnode.attrs.model.error ? [ m(".error", vnode.attrs.model.error) ] :
        vnode.attrs.model.list ? [ vnode.children ] : m(".loading-icon", [
          m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
          m('span.sr-only', 'Loading...')
        ]);
      
    }
  
}
*/
/*
const vuTable = {
  
  view (vnode) {
    //let model = vnode.attrs.model;
    //console.log(model);
    return vnode.attrs.model.error ? [ m(".error", vnode.attrs.model.error) ] :
      vnode.attrs.model.list ? [
        m(vuPanel, { header: vnode.attrs.header } ),
        vnode.children
      ] : m(".loading-icon", [
            m('.i.fa.fa-refresh.fa-spin.fa-3x.fa-fw'),
            m('span.sr-only', 'Loading...')
      ]);
  }
}
*/
const vuSprav = {
  view: function(vnode) {
    return m('div', {
        style: "margin: 0 auto; padding-top: 5em; width: 50%;"
      },
      /*
      m(".pure-g", [
        m(".pure-u-1-6",
          m("a.pure-button.pure-button-primary",
            { href: "#!/new-card", style: "font-size: 1.2em; font-weight: 600" }, "Карта"),
        ),
        m(".pure-u-1-6",
          m('a.pure-button.pure-button-primary',
            { href: "#!/new-talon", style: "font-size: 1.2em; font-weight: 600" }, "Талон"),
        )
      ]),
      */
      m('h1.blue', {style: "font-size: 3em;"}, vnode.attrs.text)
    );
  }
}

const vuView = function(view) {
  return m(vuMain, spravMenu, view);
}


export { vuSprav, vuTheader, vuFind, vuForm, vuView };