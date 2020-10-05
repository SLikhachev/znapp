
import { states, disp } from '../../apps/appApi';
import { checkArray } from '../../apps/model/moModel';
import { changedItem, changeValue, target } from '../../apps/model/moListItem';


const form_filds = ['code_usl', 'ccode', 'grup'];

// get first field name
export const get_pmu_field = () => form_filds.
  filter( f => !!changedItem()[f] )[0] || '';

export const find_in = (state, hash_map) => (hash_key, field_to_find, value) => (
  state()[hash_map] && state()[hash_map].get(hash_key) &&
  state()[hash_map].get(hash_key).
  find(o=> o[field_to_find] == value) || {}
);

const find_in_data = find_in(states, 'data');

const find_in_opts = find_in(states, 'options');

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
  //
  // OUTPUT for save in para_table
  // para -> tal_num, date_usl, code_usl, kol_usl, 
  // exec_spec, exec_doc, exec_podr, error
  //
  // return the first error if any
  //
  //console.log(pmu);
  
  // 1st ignore if present in lal_pmu 
  if ( !R.isEmpty( find_in_data('tal_pmu', 'code_usl', pmu.code_usl) ) )
    return {};

  let exec_spec= Number( pmu.code_spec ) || 0;
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

const tal_pmu = (pmu, idx) => Object.assign(
  pmu, { 
    name: states().options.get('pmu')[idx].name || '',
    ccode: states().options.get('pmu')[idx].ccode || '',
  }
);

export const update_pmus = pmus => {
  let $tal_pmu = states().data.get('tal_pmu') || [];
  return pmus.reduce(
    (result, pmu, idx) => 
      $tal_pmu.find( p => p.code_usl == pmu.code_usl) ? 
      // if find this code then return as is, else push absent pmu 
      [...result] : [...result, tal_pmu(pmu, idx)],
      []
  );
};

const empty_error = {
   grup: 'Нет такой группы услуг',
   ccode: 'Нет такого номера услуги',
   code_usl: 'Нет ткого кода услуги'
};

export const prep_to_save_pmus = pmus => pmus.
  map( p => proc_pmu(p) ).filter( p => !R.isEmpty(p) );


export const add_pmus = (field, event) => pmus => {
  if(!checkArray(pmus))
    return Promise.reject({
      error: empty_error[field]
    });

  let pmu$ = prep_to_save_pmu(pmus);
  if (R.isEmpty( pmu$ ))
    return false;
  
  let error = pmu$.find( p => !!p.error ) || {};
  if (!R.isEmpty(error))
    return Promise.reject({
      error: `Ошибка элемента группы: ${error.error.toString()}`
    });
  
  //states().options.set('pmu', pmu); // for talon pmu presentation
  
  disp([
    'set_pmu', 
    pmus.filter( 
      p => !R.isEmpty( (pmu$.find( p$ => p$.code_usl == p.code_usl) || {} ) ) 
    )
  ]);
  

  // only new pmu to save and tal_pmu update
  return disp(['save_items', 'pmu', event, 'POST', [...pmu$]]);
  
 
  //let old_pmus = states().data.get('tal_pmu');
  //states().data.set('tal_pmu', [...old_pmus, ...new_pmus]);
  //return '';
 
};

