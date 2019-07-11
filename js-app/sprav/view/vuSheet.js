// src/sprav/view/vuSheet.js


import { moModel } from '../../apps/model/moModel.js';
import { vuLoading } from '../../apps/view/vuApp.js';
import { vuDialog } from '../../apps/view/vuDialog.js';
import { change, vuTheader, vuFilter, vuForm } from './vuSprav.js';
import { vuListTable } from './vuListTable';


export const vuDialogForm= function(data){
  let {header, name, word, method, model, itemForm }= data;
  return m(vuDialog, { header: header, word: word },
    m(vuForm, { model: model, name: name },
      m(itemForm, { model: model, method: method } )
    )
  );
}

// clojure
export const vuSheet = function (vnode) {
 
  let {
    model, header, name, struct, filter=0, //filter int of fields to order
    href='', itemForm
  }= vnode.attrs;
  
  const edit= e => change(e, model, 'PATCH', 'Изменить');
  const ddel= e => change(e, model, 'DELETE', 'Удалить');
  const edialog={}; 
  let { editable }= model;

  if (Boolean( editable ) && editable instanceof Array){
      edialog.add= editable.indexOf('add') >= 0 ? true : false;
      if (editable.indexOf('edit') >= 0) edialog.edit= edit;
      if (editable.indexOf('del') >= 0) edialog.ddel= ddel;
  }
  const dialog= edialog.add || edialog.edit || edialog.ddel;
  const sort=  e=> model.sort(e.target.getAttribute('data'));   
  //const table= {struct, edialog, href, sort};

  return {
    
    oninit () {
      moModel.getList( model );
      moModel.getData( model );
    },
    view () {
      //console.log(itemForm);
      return model.error ? [ m(".error", model.error) ] :
        model.list ? [
          m(vuTheader, { header: header} ),
          filter ? m(vuFilter, {cols: filter, model: model, add: edialog.add} ) : '',
          m(vuListTable, {struct: struct, edialog: edialog, href: href, sort: sort, model: model} ),
          dialog ? itemForm ? // set in parent view if any
            m(vuDialog, { header: header, word: vuForm.word },
              m(vuForm, { model: model, name: name },
                m(itemForm, { model: model, method: vuForm.method } )
              )
            ) : m('h2', 'Не определена форма редактирования объекта')
          : '' // not editable
        ] : m(vuLoading);
    }
  }; //return this object
}

