
// src/sprav/view/dsTNM.js

import { moModel } from '../../apps/model/moModel.js';
import { fieldFrom } from '../../apps/form/foForm';
import { restSprav } from '../spravApi.js';
//import { vuPmuList } from './vuPmuList.js';
import { vuSheet } from './vuSheet';
import { fetchForm } from './vuSprav';

// label = [class, text], if null no label
// input = tag = [class, type, tabindex (int), required(bool)]

const Item = {
  code_usl: { label: ['', "Код услуги"], input: {
      tag: ['', "text"],
      attrs: { readonly: true }
    }
  },
  code_podr: { label: ['', 'Подр'], input: {
      tag: ['', 'text', 1],
    }
  },
  code_spec: { label: ['', 'Спец'], input: {
      tag: ['', 'text', 2],
    }
  },
}

const itf = function(f, d) { return fieldFrom(Item, f, d, a); };

const itemForm = function(vnode){
  let item; //= vnode.attrs.item;
 
  let fld = ['code_usl', 'code_podr', 'code_spec'];
  return {  
    onbeforeupdate(vnode) {
      item= vnode.attrs.model.item;
    },
    view(vnode) {
      //item= vnode.attrs.model.item;
      //console.log(item);
      return m('fieldset', [
        item ? fld.map( f => m('.pure-control-group', itf(f, item)) ): ''
      ]);
    },
  };
}

const Fetch = {
  num_usl: { label: ['', "Номер услуги"], input: {
      tag: ['.input-find.pure-u-3-4[min=1]', "number"],
      //attrs: { placeholder: "Номер услуги" }
    }
  },
  code_usl: { label: ['', "Код услуги"], input: {
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
  let flds= ['num_usl', 'code_usl'];
  //console.log( vnode );
  let on_submit = function (event) {
    // button FIND click event handler callback
    event.preventDefault();
    let { num_usl: nu='', code_usl: cu='' } = data, q;
    if (nu.length < 1 && cu.length < 3) return false;
    //console.log(nu, cu);
    if ( nu.length > 0) {
      q= `?ccode=gte.${nu}`;
    } else {
      q= `?code_usl=ilike.${cu}*`;
    }
    //console.log(q);
    model.url=restSprav.pmu.url + `${q}&limit=20`;
    //console.log(model.url);
    return moModel.getList(model);
    //m.redraw();
    //return false;
  };
  return fetchForm( {  on_submit, data, flds, ffunc: pmu} );
}; //func

// clojure
export const vuPmu = function (vnode) {
  vnode.attrs.fetchForm= pmuFind;
  let view = vuSheet(vnode);
  return view;
}

