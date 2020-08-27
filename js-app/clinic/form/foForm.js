

import { makeTags } from '../../apps/form/makeTags';


export const makeFields = (fn, flds, ind=0) => 
  flds.map((f, ix) => 
    m('.pure-control-group', fn(f, ind*20+ix+1)));


export const makeGroup = (group, ind) => m(group.class,
  makeFields(makeTags(group.fields), Object.keys(group.fields), ind)
);


export const makeFormChildren = form => 
  Object.keys(form).map(
    (group, ind) => makeGroup(form[group], ind)
);
