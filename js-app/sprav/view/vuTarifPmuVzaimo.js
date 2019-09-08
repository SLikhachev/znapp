
// src/sprav/view/dsTNM.js

import { moModel } from '../../apps/model/moModel.js';
import { fieldFrom } from '../../apps/form/foForm';
import { restSprav } from '../spravApi.js';
import { vuSheet } from './vuSheet';
import { fetchForm } from './vuSprav';

// label = [class, text], if null no label
// input = tag = [class, type, tabindex (int), required(bool)]

const Item = {
  code: { label: ['', "Код услуги"], input: {
      tag: ['', "text"],
      attrs: { readonly: true }
    }
  },
  tarif: { label: ['', 'Тариф'], input: {
      tag: ['', 'text'],
    }
  },
}

const itemForm = function(vnode){
  let item; //= vnode.attrs.item;
  const _it = function(f, d, a={}) { return fieldFrom(Item, f, d, a); };
  let fld = ['code', 'tarif'];
  const fld_fun= item=> {
    return [
      fld.map( f => m('.pure-control-group', _it(f, item)) ),
      m('span', item.name )
    ];  
  };
  return {  
    onbeforeupdate(vnode) {
      item= vnode.attrs.model.item;
    },
    view() {
      //item= vnode.attrs.model.item;
      //console.log(item);
      return m('fieldset', [
        item ? fld_fun(item) : ''
      ]);
    },
  };
}

const Fetch = {
  code: { label: ['', "Код услуги"], input: {
      tag: ['.input-find.pure-u-3-4', "text"],
      //attrs: { placeholder: "Код услуги" }
    }
  },
}

const pmu= function(f, d) {
  //const a= { fval: v=> v ? v : "", onkeyup: e=> d[f]= e.target.value};
  return fieldFrom(Fetch, f, d, {});
}

const pmuFind = function ( model ) {
  
  //let { model }= vnode.attrs, data={};
  let data= model.item;
  let flds= ['code'];
  //console.log( vnode );
  let on_submit = function (event) {
    // button FIND click event handler callback
    event.preventDefault();
    let { code: cu='' } = data, q;
    if ( cu.length < 3) return false;
    q= `?code=ilike.${cu}*`;
    model.url=restSprav.tarif_pmu_vzaimo.url + `${q}&limit=20`;
    return moModel.getList(model);
  };
  return fetchForm( {  on_submit, data, flds, ffunc: pmu} );
}; //func

// clojure
export const vuTarifPmuVzaimo = function (vnode) {
  vnode.attrs.fetchForm= pmuFind;
  vnode.attrs.itemForm= itemForm;
  let view = vuSheet(vnode);
  return view;
}

