
import { makeTags } from '../../apps/form/makeTags';


const makeFields = (fn, flds) => flds.map((f, idx) => fn(f, idx));

export const vuTaskFormChildren = () => {

    let task, form;
    const T = R.not(R.isEmpty);

    return {
        view(vnode) {
            ({ task } = vnode.attrs);
            form = task.form || {};

            //console.log(def.fetch);
            return T(form) ? makeFields(makeTags(form), Object.keys(form)) : '';
        }
    }
}; 
