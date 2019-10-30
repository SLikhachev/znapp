

import { fieldFrom } from '../../apps/form/foForm';
import { itForm } from './foItem';

//export const itForm = function(flds, func, vnode){
/*
return item form editanle item of sprav model
flds - array of fields to edit
func- function returns field represent
item - item to edit
*/
const Profil= {
  id: { label: ['', "Код"], input: {
      tag: ['.lcode', "number"],
      attrs: { readonly: true }
    }
  },
  name: { label: ['', 'Профиль'], input: {
      tag: ['.fname[size=54]', 'text'],
      attrs: { readonly: true }
    }
  },
  one_visit: { label: ['', "ПМУ посещение"], input: {
      tag: ['.fname[size=54]', 'text', 3],
    }
  },
  two_visit: { label: ['', "ПМУ обращени"], input: {
      tag: ['.fname[size=54]', 'text', 4],
    }
  },
  podr: { label: ['', "Подразделение"], input: {
      tag: ['.lcode', "number", 5],
    }
  },
}
export const itemProfil = function(vnode){
  //return itForm( Object.assign( { flds: ['id', 'name'], ffunc: itf }, vnode.attrs ) );
  const _it = function(f, d, a={}) { return fieldFrom(Profil, f, d, a); };
  let flds= [ 'id', 'name', 'one_visit', 'two_visit', 'podr'];
  //let flds= [ 'id', 'name', 'one_visit', 'two_visit', 'podr'];
  return itForm( flds, _it, vnode );
}
//=================================================
const TarifBase= {
  name: { label: ['', "Тариф"], input: {
      tag: ['.fname[size=54]', "text"],
    }
  },
  tarif: { label: ['', 'Размер'], input: {
      tag: ['.fname[size=54]', 'text'],
    }
  },
}
export const itemTarifBase = function(vnode){
  //return itForm( Object.assign( { flds: ['id', 'name'], ffunc: itf }, vnode.attrs ) );
  let flds= [ 'name', 'tarif'];
  const _it = function(f, d, a={}) { return fieldFrom(TarifBase, f, d, a); };
  return itForm( flds, _it, vnode );
}

