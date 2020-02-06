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
  /* common view for sprav
  attrs if defined:
  model - required model object,
      if model has editable array ( set in spravApi.restSprav of 3 words: add, del, edit ),
      then dialog window will be defined to change the item of sprav
      add - may add item
      del - may del item
      edit - may edit item
      if model has change array of strings then this fields ( names) will be editable
  header - required header string for view page,
  name - string requred for item edit form as header in dialog window,
  struct - required object represent items in table: order and names of tabel's header,
  filter - int represent number of columns to fiter tables row from 1  ,
  href - if defined then first column will be route to another page of this app,
  itemForm - if defined then yhis form will bu used for change item in dialog window,
  fetchForm - if defined then this form will be used for fetch items from sql table
    in that case items will not be showed in table as for simple tables (short tables)
  */
 
  let {
    model, header, name, struct, filter=0, //filter int of fields to order
    href='', itemForm=null, fetchForm=null
  }= vnode.attrs;
  //console.log( typeof fetchForm );
  //console.log(href);
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
  
  if (href) delete edialog.edit; 
  
  if ( fetchForm === null ) {
    moModel.getList( model );
    moModel.getData( model );
  } else {
    model.getItem(null);
  }
  
  return { view () {
    //console.log(itemForm);
    return [
      header ? m(vuTheader, {header: header}) : '',
      fetchForm ? fetchForm( model ) : '',
      model.error ? m(".error", model.error) :
        !model.list ? m(vuLoading) : [
          filter ? m(vuFilter, {cols: filter, model: model, add: edialog.add} ) : '',
          m(vuListTable, {struct: struct, edialog: edialog, href: href, sort: sort, model: model} ),
          !dialog ? '' : !itemForm ? '' : // set in parent view if any
            m(vuDialog, { header: header, word: vuForm.word },
              m(vuForm, { model: model, name: name },
                m(itemForm, { model: model, method: vuForm.method } )
              )
            )
        ] 
      ];
    }
  }; //return this object
}

