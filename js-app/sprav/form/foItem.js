
import { fieldFrom } from '../../apps/form/foForm';

export const itForm = function(fld, func, vnode){
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
        item ? fld.map( f => m('.pure-control-group', func(f, item)) ): ''
      ]);
    },
  };
}

// label = [class, text], if null no label
// input = tag = [class, type, tabindex (int), required(bool)]

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

const itf = function(f, d, a={}) { return fieldFrom(Item, f, d, a); };

export const itemForm = function(vnode){
  return itForm( Object.assign( { fld: ['id', 'name'], ffunc: itf }, vnode.attrs ) );
}
