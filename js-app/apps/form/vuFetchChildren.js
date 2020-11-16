

'use strict';

import { makeTags } from './makeTags';


const makeFields = (fn, flds) => flds.map((f, idx) => fn(f, idx));

export const vuFetchFormChildren = () => {

  let def, fetch;

  return {
    view(vnode) {
      ({ def } = vnode.attrs);

      fetch = def.fetch || null;
      //console.log(def.fetch);
      return fetch ? makeFields(makeTags(fetch), Object.keys(fetch)) : '';
    }
  };
}; 
