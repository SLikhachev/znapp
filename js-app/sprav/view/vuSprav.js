// src/sprav/view/vuSprav.js

import { vuMain } from '../../apps/view/vuMain.js';
import { vuDialog } from '../../apps/view/vuDialog.js';
import { spravMenu } from '../spravApi.js';
import { moModel } from '../../apps/model/moModel.js';

export const change= function(e, model, method, word) {
    //console.log(word);
    e.preventDefault();
    item_id= e.target.getAttribute('data');
    vuForm.method= method;
    vuForm.word= word;
    model.getItem(item_id);
    vuDialog.open();
    return false;
  };

// Forms in dialog window for catalogs 
export const vuForm = {
  
  item: null,
  method: "",
  word: "",
  model: null,
  name: "",
  
  onSubmit(e) {
    e.preventDefault();
    if (vuForm.model !== null && vuForm.model.item !== null) {
      moModel.dialogFormSubmit(e, vuForm.model, vuForm.method);
    }
    //vuDialog.close();
    return false;
  },
  
  oninit(vnode) {
    //vuDialog.model = vnode.attrs.model;
    vuForm.model = vnode.attrs.model;
    vuForm.name = vnode.attrs.name;
  },
    
  view(vnode) {
    return [m('form.pure-form.pure-form-aligned',
      { id: 'moform', onsubmit: vuForm.onSubmit }, [
        vnode.children,
        m('.pure-controls', [
            //m('input[type=hidden][name=method]', {value: method} ),
            m('button.pure-button[type=submit]', vuForm.word),
        ])
      ]), // form
      vuForm.model.save && vuForm.model.save.err ?
        [m('br'), m('span.red', 'Ошибка базы данных:'),
        m('br'), m('span.red', `${vuForm.model.save.msg}`)] : ''
    ]; // return
  },
};

export const vuTheader = {
  view (vnode) {
    return m(".pure-g", m(".pure-u-1-1.box-1",
        m('span.dheader', vnode.attrs.header )
      )
    );
  }
};

const vmFind = {
  
  trCols: 2, // how many tr childern (table columns) get to find 
  toFind: "",
  setFind: function(e) {
    let str = e.target.value; 
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
  
};

export const vuFind = {
  
  model: null,
  
  addItem(e) {
    e.preventDefault();
    vuForm.method= 'POST';
    vuForm.word= 'Добавить';
    vuFind.model.getItem(null);
    vuDialog.open();
    return false;
  },
  
  oninit(vnode) {
    vuFind.model= vnode.attrs.model;
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
                  onkeyup: vmFind.setFind,
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
                vnode.attrs.model.add ? 
                m('button.pure-button.pure-button-primary[type="button"]', {
                    onclick: vuFind.addItem
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

export const vuSprav = {
  view: function(vnode) {
    return m('div',
      { style: "margin: 0 auto; padding-top: 5em; width: 50%;" },
      m('h1.blue', {style: "font-size: 3em;"}, vnode.attrs.text)
    );
  }
};

export const vuView = function(view) {
  return m(vuMain, spravMenu, view);
};


