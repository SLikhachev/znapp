// src/sprav/view/vuSprav.js

import { vuMain } from '../../apps/view/vuMain.js';
import { vuView } from '../../apps/view/vuApp.js';
import { vuDialog } from '../../apps/view/vuDialog.js';
import { spravMenu } from '../spravApi.js';
import { moModel } from '../../apps/model/moModel.js';

export const fetchForm= function( attrs ){
  //console.log(attrs)
  let { on_submit, data, flds, ffunc } = attrs;
    return m(".pure-g",
      m(".pure-u-1-2",
        m("form.pure-form", { onsubmit: on_submit },
          m("fieldset", m(".pure-g", [
            flds.map( f=> m(".pure-u-1-4", ffunc(f, data)) ),
            m(".pure-u-1-5",
                m('button.pure-button.pure-button-primary[type="submit"]',
                  {style:'margin-top: 1.7em'} ,
                 "Выбрать")
            )
          ]))
        ) //form
      ) // u-1-2
    ); // g return
}; //func


export const change= function(e, model, method, word) {
    //console.log(word);
    //e.preventDefault();
    item_id= e.target.getAttribute('data');
    vuForm.method= method;
    vuForm.word= word;
    model.getItem(item_id);
    vuDialog.open();
    return true;
  };

// Forms in dialog window for catalogs 
export const vuForm = {
  
  item: null,
  method: "",
  word: "",
  model: null,
  name: "",
  
  onSubmit(e) {
    e.preventDefault(); // if not then in route we will see wrong path (method GET + all form fields)
    if (vuForm.model !== null && vuForm.model.item !== null) {
      moModel.formSubmit(e, vuForm.model, vuForm.method);
    }
    //vuDialog.close();
    //moModel.getList(vuForm.model);
    return true;
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


export const vmFilter = {
  
  tr_cols: 2, // how many tr childern (table columns) get to find 
  to_find: "",
  setFilter: function(e) {
    let str = e.target.value; 
    vmFilter.to_find = str.toLowerCase();
    $.each( $('table#list_table tbody tr'), function(ind, tr) {
      let subtr = $(tr).children().slice(0,vmFilter.tr_cols);
      //console.log( subtr );
      if (subtr.text().toLowerCase().indexOf(vmFilter.to_find) === -1) {
        $(tr).hide();
      } else {
        $(tr).show();
      }
      m.redraw();
    });
  }
  
};


export const vuFilter = {
  
  model: null,
  add: false,
  
  addItem(e) {
    //e.preventDefault();
    vuForm.method= 'POST';
    vuForm.word= 'Добавить';
    vuFilter.model.getItem(null);
    vuDialog.open();
    //return false;
  },
  
  oninit(vnode) {
    vuFilter.model= vnode.attrs.model;
    vuFilter.add= vnode.attrs.add; 
    vmFilter.tr_cols = vnode.attrs.cols ? vnode.attrs.cols : 2;
    vmFilter.to_find = "";
    
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
                  onkeyup: vmFilter.setFilter,
                  value: vmFilter.to_find
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
                vuFilter.add ? 
                  m('button.pure-button.pure-button-primary[type="button"]', {
                    onclick: vuFilter.addItem
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


//export const vuView = (appMenu, view)=> m(vuMain, appMenu, view);
export const vuSprav = view=> vuView(spravMenu, view);


