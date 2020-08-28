

import { _klass, makeTags } from '../../apps/form/makeTags';


export const makeFields = (fn, group, flds, ind) => flds.map((f, ix) => {
    let wrap = _kalss(group[f].wrap) || '.pure-control-group';
    return m(wrap, fn(f, ind*20+ix+1));
});


export const makeGroup = (group, ind) => m(group.class,
  makeFields(makeTags(group.fields), group.fields, Object.keys(group.fields), ind)
);


export const makeFormChildren = (form, idx=0) => 
  Object.keys(form).map(
    (group, ind) => makeGroup(form[group], ind + idx)
);
