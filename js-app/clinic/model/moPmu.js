
import { checkArray } from '../../apps/model/moModel';
import { changedItem, changeValue, target } from '../../apps/model/moListItem';


const form_filds = ['code_usl', 'ccode', 'grup'];

// get first field name
export const get_pmu_attr = () => form_filds.
  filter( f => !!changedItem()[f] )[0] || '';

const find_in_opts = (opt_key, field_to_find, value) => (
  states().options && states().options.get(opt_key) &&
  states().options.get(opt_key).
  find(o=> o[field_to_find] == value) || {}
);

// return doctor code for input spec
const get_doc_code= spec=> {
  // if talon to this doctor spec then this doctor spec
  if ( !!changedItem().doc_spec && 
      !!changedItem().doc_code && 
      changedItem().doc_spec == spec
    ) return changedItem().doc_code;
      
  // else first doc with this spec from all doctors
  let doc = find_in_opts('doctor', 'spec', spec);
  if ( R.isEmpty( doc ))
    return 0; // error
  
  return doc.code;
};
  

const proc_pmu= pmu=> {
  //INPUT
  // pmu -> code_usl, name, code_podr, code_spec
  // OUTPUT
  // para -> tal_num, date_usl, code_usl, kol_usl, 
  // exec_spec, exec_doc, exec_podr, error
  //
  // return the first error if any
  //
  let exec_spec= Number( item.code_spec ) || 0;
  if ( !exec_spec )
    return { error: `Код специалиста ПМУ не число: ${pmu.code_usl}`}; //error 
  
  let exec_doc= get_doc_code(exec_spec);
  if ( !exec_doc )
    return { error: `В МО нет доктора по специальности: ${exec_spec}`}; //error   

  let exec_podr= pmu.code_podr ? pmu.code_podr : 281;
  
  let talon = changedItem();  
  return {
    tal_num: talon.tal_num, date_usl: talon.open_date,
    code_usl: pmu.code_usl, kol_usl: 1, 
    exec_podr, exec_spec, exec_doc
   };
};
 

export const add_pmu_grup = pmu => {
  if(!checkArray(pmu))
    return Promise.reject('Нет такой группы');

  let _pmu = pmu.map( p => proc_pmu ), 
    error = _pmu.find( p => !!p.error ) || {};   
  
  if (!R.isEmpty(error))
    return Promise.reject(`Ошибка элемента группы: ${error.error.toString()}`);

  //return disp(['save', 'pmu', _pmu]);
  states.data.set('tal_pmu', [...states.data.get('tal_pmu'), ..._pmu]);
  return false;
};
