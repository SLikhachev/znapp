
// src/sprav/view/vuMkb.js

import { moModel } from '../../apps/model/moModel.js';
import { fieldFrom } from '../../apps/form/foForm';
import { restSprav } from '../spravApi.js';
//import { vuPmuList } from './vuPmuList.js';
import { vuSheet } from './vuSheet';
import { fetchForm } from './vuSprav';

const Fetch = {
  code: { label: ['', "Код диагноза МКБ-10"], input: {
      tag: ['.input-find.pure-u-3-4', "text"],
      //attrs: { placeholder: "Код услуги" }
    }
  },
}

const form= function(f, d) {
  //const a= { fval: v=> v ? v : "", onkeyup: e=> d[f]= e.target.value};
  return fieldFrom(Fetch, f, d, {});
}

const foFind = function ( model ) {
  
  //let { model }= vnode.attrs, data={};
  let data= model.item;
  let flds= ['code'];
  let on_submit = function (event) {
    // button FIND click event handler callback
    event.preventDefault();
    let { code: co='' } = data, q;
    if (co.length < 2) return false;
    q= `?code=ilike.${co}*`;
    model.url=restSprav.mkb.url + `${q}&limit=20`;
    return moModel.getList(model);
  };
  return fetchForm( {  on_submit, data, flds, ffunc: form} );
}; //func

// clojure
export const vuMkb = function (vnode) {
  vnode.attrs.fetchForm= foFind;
  let view = vuSheet(vnode);
  return view;
}

