
import { fieldFrom } from '../../apps/form/foForm';

//export const fieldFrom = function (fromObj, field, data, to_attrs={}) {
  // fromObj - object with form fields (label, input) description
  // field - fromObj attribute name for form field (form input tag name is equal  to attr name)
  // data - object gets actual data from (model field)
  // to_attrs = additional attrs to be set to input tag

// return only fieldset html
export const itForm = function(flds, func, vnode){
/*
return item form editanle item of sprav model
flds - array of fields to edit
func- function returns field represent
item - item to edit
*/
  let item; //= vnode.attrs.item;
 
  //let fld = fld;
  //let func= vnode.attrs.ffunc;
  
  return {  
    onbeforeupdate(vnode) {
      item= vnode.attrs.model.item;
    },
    view(vnode) {
      //item= vnode.attrs.model.item;
      //console.log(item);
      return m('fieldset', [
        item ? flds.map( f => m('.pure-control-group', func(f, item)) ): ''
      ]);
    },
  };
}

// label = [class, text], if null no label
// input = tag = [class, type, tabindex (int), required(bool)]
// Item object for simple model of id and name fields only
export const Item= {
  id: { label: ['', "Номер"], input: {
      tag: ['.lcode', "number", 1, true],
      attrs: { autofocus: true }
    }
  },
  name: { label: ['', 'Наименование'], input: {
      tag: ['.fname[size=54]', 'text', 2],
    }
  },
}
// represent item form

export const itemForm = function(vnode){
  const itf = function(f, d, a={}) { return fieldFrom(Item, f, d, a); };
  //return itForm( Object.assign( { flds: ['id', 'name'], ffunc: itf }, vnode.attrs ) );
  let flds= ['id', 'name'];
  return itForm( flds, itf, vnode );
}


