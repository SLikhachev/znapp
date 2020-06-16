
import { idName } from '../defines/defStruct';
import { makeTags } from './makeTags';

const makeFields = (fn, flds) => flds.map((f, idx) => m('.pure-control-group', fn(f, idx)));

export const vuItemFormChildren = () => {

  let itdef, struct, flds;

  return {
    view(vnode) {
      ({ itdef } = vnode.attrs);
      struct = itdef.struct || idName;
      flds = itdef.form || Object.keys(struct);
      return m('fieldset', makeFields(makeTags(struct), flds));
    }
  }
}
