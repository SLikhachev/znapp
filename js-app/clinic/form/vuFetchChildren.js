
import { makeTags } from '../../apps/form/makeTags';


const makeFields = (fn, flds) => flds.map((f, idx) => m('.pure-u-1-5', fn(f, idx)));

export const vuFetchFormChildren = () => {

    let def, fetch;

    return {
        view(vnode) {
            ({ def } = vnode.attrs);

            fetch = def.fetch || null;
            //console.log(def.fetch);
            return fetch ? makeFields(makeTags(fetch), Object.keys(fetch)) : '';
        }
    }
}; 
