

import { _klass, makeTags } from '../../apps/form/makeTags';


export const makeFields = (fn, group, flds, ind) => flds.map((f, ix) => {
    let wrap = group[f].wrap || {},
      box= _klass(wrap.klass) || '.pure-control-group',
      attrs = wrap.attrs || {}; 
    return m(box, attrs, fn(f, ind*20+ix+1));
});


export const makeGroup = (group, ind) => m(group.class,
  makeFields(makeTags(group.fields), group.fields, Object.keys(group.fields), ind)
);


export const makeFormChildren = (form, idx=0) => 
  Object.keys(form).map(
    (group, ind) => makeGroup(form[group], ind + idx)
);

export const $legend = text =>({
  class: 'legend',
  fields: {
    lend: {
      type: 'memo',
      memo: { check: () => text }
    }  
  }
});