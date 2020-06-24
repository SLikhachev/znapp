
import { makeTags } from '../../apps/form/makeTags';

const makeFields = (fn, flds) => flds.map((f, idx) => m('.pure-control-group', fn(f, idx)));
const makeButtons = (fn, flds) => flds.map((f, idx) => fn(f, idx));

const checkAttrs = attrs => typeof attrs === 'object' ? attrs : {};

export const vuTaskFormChildren = () => {

  let task, form, buttons;

  return {
    view(vnode) {
      ({ task } = vnode.attrs);
      ({ form, buttons } = task);

      return [
        !R.isEmpty(checkAttrs(form)) ?
          makeFields(makeTags(form), Object.keys(form)) : '',
        !R.isEmpty(checkAttrs(buttons)) ? m('.pure-controls',
          makeButtons(makeTags(buttons), Object.keys(buttons))) : ''
      ]
    }
  }
}; 
